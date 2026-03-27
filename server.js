
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


/* ---------------- ROUTES ---------------- */
// const contactRoutes = require("./routes/contactRoutes");
// const feedbackRoutes = require("./routes/feedbackRoutes");
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
app.get("/summaries", async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });

    res.json(summaries);

  } catch (error) {
    console.log("GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
/* ---------------- PDF UPLOAD + AI ---------------- */

app.post("/upload-pdf/:caseId", upload.single("file"), async (req, res) => {
  try {
    const { caseId } = req.params;

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text.replace(/\s+/g, " ").slice(0, 8000);
console.log("CASE ID TYPE:", typeof caseId, caseId);
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
      caseId: caseId, // TEMP FIX
      filename: req.file.originalname,
      summary: result,
    });

    await newSummary.save();

    res.json({ summary: result });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/arguments", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "No content provided" });
    }

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a legal assistant AI.",
        },
        {
          role: "user",
          content: `Generate strong legal arguments for BOTH sides (plaintiff and defendant) based on this case:\n\n${content}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const result = aiResponse.choices[0].message.content;

    res.json({ arguments: result });

  } catch (error) {
    console.log("ARGUMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
/* ---------------- CHAT / ARGUMENT GENERATOR ---------------- */
app.post("/analyze-case", async (req, res) => {
  try {
    const { content } = req.body;

    // 🔹 Step 1: Summarize
    const summaryRes = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize this legal case:\n\n${content}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const summary = summaryRes.choices[0].message.content;

    // 🔹 Step 2: Generate Arguments
    const argumentRes = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Based on this case summary, generate strong arguments for both plaintiff and defendant:\n\n${summary}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const argumentsText = argumentRes.choices[0].message.content;

    // 🔹 Save (optional)
    const newSummary = new Summary({
      caseId: Date.now().toString(),
      filename: "New Case",
      summary,
    });

    await newSummary.save();

    res.json({
      summary,
      arguments: argumentsText,
    });

  } catch (error) {
    console.log("ANALYZE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
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
