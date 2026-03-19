const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");
const fs = require("fs");

const Case = require("./models/Case");
const Summary = require("./models/Summary");
const Document = require("./models/Document");

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

const PORT = 5000;

/* ---------------- AI SETUP ---------------- */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ---------------- DATABASE ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ---------------- BASIC ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("AdvocAI backend running");
});

/* ---------------- CREATE CASE ---------------- */

app.post("/create-case", async (req, res) => {
  try {
    const { title, description } = req.body;

    const newCase = new Case({
      title,
      description
    });

    await newCase.save();

    res.json({
      message: "Case created",
      case: newCase
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- UPLOAD + AI SUMMARY ---------------- */

app.post("/upload-pdf/:caseId", upload.single("file"), async (req, res) => {
  try {

    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const caseId = req.params.caseId;

    // 🔥 Step 1: Read file
    let dataBuffer;
    try {
      dataBuffer = fs.readFileSync(req.file.path);
      console.log("File read success");
    } catch (err) {
      console.log("FILE READ ERROR:", err);
      return res.status(500).json({ error: "File read failed" });
    }

    // 🔥 Step 2: Parse PDF
    let pdfData;
    try {
      pdfData = await pdfParse(dataBuffer);
      console.log("PDF parsed");
    } catch (err) {
      console.log("PDF PARSE ERROR:", err);
      return res.status(500).json({ error: "PDF parsing failed" });
    }

    const text = pdfData.text.replace(/\s+/g, " ").slice(0, 8000);

    // 🔥 Step 3: AI
    let result;
    try {
      const aiResponse = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Summarize this legal document:\n${text}`
          }
        ],
        model: "llama-3.3-70b-versatile"
      });

      result = aiResponse.choices[0].message.content;
      console.log("AI success");

    } catch (err) {
      console.log("AI ERROR:", err);
      return res.status(500).json({ error: "AI failed" });
    }

    // 🔥 Step 4: Save
    const newSummary = new Summary({
      caseId,
      filename: req.file.originalname,
      summary: result
    });

    await newSummary.save();

    res.json({
      message: "Success",
      summary: result
    });

  } catch (error) {
    console.log("FINAL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- GENERATE TIMELINE ---------------- */

app.post("/generate-timeline", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text.replace(/\s+/g, " ").slice(0, 8000);

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
You are a legal assistant AI.

Extract all important dates and events from the document.

Format:
DATE - EVENT

Document:
${text}
`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const timeline = aiResponse.choices[0].message.content;

    res.json({
      message: "Timeline generated",
      timeline
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- GET DOCUMENTS BY CASE ---------------- */

app.get("/case/:caseId/documents", async (req, res) => {
  try {

    const caseId = req.params.caseId;

    const summaries = await Summary.find({ caseId });

    res.json(summaries);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- SIMPLE TEXT SUMMARY ---------------- */
app.post("/chat/:caseId", async (req, res) => {
  try {

    const caseId = req.params.caseId;
    const { message } = req.body;

    const documents = await Summary.find({ caseId });

    const context = documents
      .map(doc => doc.summary)
      .join("\n\n");

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a legal assistant AI.

Use the provided case documents to answer the user's question.
Generate clear legal arguments when needed.
`
        },
        {
          role: "user",
          content: `
Case documents:
${context}

User question:
${message}
`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const reply = aiResponse.choices[0].message.content;

    res.json({
      reply
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/summarize", async (req, res) => {
  try {

    const { title, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "No content provided" });
    }

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Summarize this legal case clearly and concisely.

${content}
`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const result = aiResponse.choices[0].message.content;

    const newDoc = new Document({
      title,
      content,
      summary: result
    });

    await newDoc.save();

    res.json({
      message: "AI summary generated",
      summary: result
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});