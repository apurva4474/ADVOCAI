
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

app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  try {
    // 1. Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const extractedText = pdfData.text.replace(/\s+/g, " ").slice(0, 8000);

    // 2. Create Case
    const newCase = new Case({
      title: req.file.originalname,
    });
    await newCase.save();

    // 3. Save Document
    const newDoc = new Document({
      caseId: newCase._id,
      filename: req.file.originalname,
      content: extractedText,
    });
    await newDoc.save();

    // 4. Generate Summary (AI)
    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize this legal document:\n\n${extractedText}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const summaryText = aiResponse.choices[0].message.content;

    // 5. Save Summary
    const newSummary = new Summary({
      caseId: newCase._id,
      text: summaryText,
    });
    await newSummary.save();

    // 6. Response
    res.json({
      caseId: newCase._id,
      summary: summaryText,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
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
app.get("/cases", async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });

    const result = [];

    for (let c of cases) {
      const summary = await Summary.findOne({ caseId: c._id });

      result.push({
        caseId: c._id,
        title: c.title,
        summary: summary ? summary.text : "No summary",
        createdAt: c.createdAt,
      });
    }

    res.json(result);
  } catch (error) {
    console.log("GET CASES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/cases/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res.status(404).json({ error: "Case not found" });
    }

    const document = await Document.findOne({ caseId: id });
    const summary = await Summary.findOne({ caseId: id });

    res.json({
      caseId: caseData._id,
      title: caseData.title,
      document: document ? document.content : null,
      summary: summary ? summary.text : null,
      createdAt: caseData.createdAt,
    });

  } catch (error) {
    console.log("GET CASE DETAILS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
/* ---------------- CHAT / ARGUMENT GENERATOR ---------------- */
app.post("/generate-arguments", async (req, res) => {
  try {
    const { caseId } = req.body;

    const summary = await Summary.findOne({ caseId });

    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }

    const aiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Based on the following legal case summary, generate strong legal arguments:\n\n${summary.text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const argumentsText = aiResponse.choices[0].message.content;

    res.json({
      caseId,
      arguments: argumentsText,
    });

  } catch (error) {
    console.log("ARGUMENT ERROR:", error);
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
