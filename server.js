
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

const PORT = process.env.PORT || 5000;

/* ---------------- AI SETUP ---------------- */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ---------------- DATABASE ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB ERROR:", err));

/* ---------------- BASIC ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("AdvocAI backend running");
});

/* ---------------- TEXT SUMMARIZER ---------------- */

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
          content: `Summarize this legal case clearly:\n\n${content}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const result = aiResponse.choices[0].message.content;

    const newDoc = new Document({
      title,
      content,
      summary: result,
    });

    await newDoc.save();

    res.json({
      message: "Summary generated",
      summary: result,
    });

  } catch (error) {
    console.log("TEXT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- PDF UPLOAD + AI ---------------- */

app.post("/upload-pdf/:caseId", upload.single("file"), async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let pdfData;

    try {
      const dataBuffer = fs.readFileSync(req.file.path);
      pdfData = await pdfParse(dataBuffer);
    } catch (err) {
      console.log("PDF ERROR:", err);
      return res.status(500).json({ error: "Invalid PDF file" });
    }

    const text = pdfData.text.replace(/\s+/g, " ").slice(0, 8000);

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize this legal document:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const result = aiResponse.choices[0].message.content;

    const newSummary = new Summary({
      filename: req.file.originalname,
      summary: result,
    });

    await newSummary.save();

    res.json({
      message: "PDF processed successfully",
      summary: result,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- CHAT / ARGUMENT GENERATOR ---------------- */

app.post("/chat/:caseId", async (req, res) => {
  try {
    const { message } = req.body;
    const { caseId } = req.params;

    const documents = await Summary.find({ caseId });

    const context = documents.map((doc) => doc.summary).join("\n\n");

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a legal assistant AI.",
        },
        {
          role: "user",
          content: `Case:\n${context}\n\nQuestion:\n${message}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = aiResponse.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.log("CHAT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

