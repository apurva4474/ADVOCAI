const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const Groq = require("groq-sdk");

const Case = require("../models/Case");
const Summary = require("../models/Summary");
const Document = require("../models/Document");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ---------------- UPLOAD PDF ---------------- */

router.post(
  "/upload-pdf",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      // READ PDF
      console.log("REQ FILE:", req.file);
      const dataBuffer = fs.readFileSync(
        req.file.path
      );

      const pdfData = await pdfParse(
        dataBuffer
      );

      const extractedText = pdfData.text
        .replace(/\s+/g, " ")
        .slice(0, 8000);

      // CREATE CASE

      const newCase = new Case({
        title: req.file.originalname,
        userId: req.userId,
      });

      await newCase.save();

      // SAVE DOCUMENT

      const newDoc = new Document({
        userId: req.userId,
        caseId: newCase._id,
        filename: req.file.originalname,
        content: extractedText,
      });

      await newDoc.save();

      /* ---------------- AI SUMMARY ---------------- */

      const prompt = `
Analyze this legal document and return ONLY valid JSON.

Format:

{
  "facts": [],
  "issues": [],
  "judgement": "",
  "legalPrinciples": []
}

Document:
${extractedText}
`;

      const aiResponse =
        await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          model:
            "llama-3.3-70b-versatile",

          temperature: 0.2,
        });

      const rawText =
        aiResponse.choices[0].message.content;

      const cleanJson = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedSummary = {};

      try {
        parsedSummary = JSON.parse(cleanJson);

      } catch (parseError) {

        console.log(
          "SUMMARY JSON ERROR:",
          parseError
        );

        parsedSummary = {
          facts: [],
          issues: [],
          judgement: rawText,
          legalPrinciples: [],
        };
      }

      // SAVE SUMMARY

      const newSummary = new Summary({
        userId: req.userId,
        caseId: newCase._id,
        text: JSON.stringify(parsedSummary),
      });

      await newSummary.save();

      // RESPONSE

      res.json({
        caseId: newCase._id,
        summary: parsedSummary,
      });

    } catch (error) {

      console.log(
        "UPLOAD PDF ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

/* ---------------- GET ALL CASES ---------------- */

router.get(
  "/cases",
  authMiddleware,
  async (req, res) => {
    try {
      const cases = await Case.find({
        userId: req.userId,
      }).sort({
        createdAt: -1,
      });

      const result = [];

      for (let c of cases) {

        const summary =
          await Summary.findOne({
            caseId: c._id,
          });

        result.push({
          caseId: c._id,
          title: c.title,

          summary: summary
            ? JSON.parse(summary.text)
            : null,

          createdAt: c.createdAt,
        });
      }

      res.json(result);

    } catch (error) {

      console.log(
        "GET CASES ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

/* ---------------- GET CASE DETAILS ---------------- */

router.get(
  "/cases/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const caseData =
        await Case.findById(id);

      if (!caseData) {
        return res.status(404).json({
          error: "Case not found",
        });
      }

      const document =
        await Document.findOne({
          caseId: id,
        });

      const summary =
        await Summary.findOne({
          caseId: id,
        });

      res.json({
        caseId: caseData._id,

        title: caseData.title,

        document: document
          ? document.content
          : null,

        summary: summary
          ? JSON.parse(summary.text)
          : null,

        createdAt: caseData.createdAt,
      });

    } catch (error) {

      console.log(
        "GET CASE DETAILS ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;