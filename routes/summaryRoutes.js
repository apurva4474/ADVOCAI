const express = require("express");
const Groq = require("groq-sdk");

const Summary = require("../models/Summary");
const Translation = require("../models/Translation");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});




/* ---------------- GET ALL SUMMARIES ---------------- */
router.get(
  "/translations/:caseId",
  authMiddleware,
  async (req, res) => {
    try {

      const translations =
        await Translation.find({
          caseId:
            req.params.caseId,
          userId:
            req.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(translations);

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);
router.get(
  "/summaries",
  authMiddleware,
  async (req, res) => {
    try {

      const summaries =
        await Summary.find({
          userId: req.userId,
        }).sort({
          createdAt: -1,
        });

      const formatted =
        summaries.map((item) => ({
          _id: item._id,

          caseId: item.caseId,

          summary:
            JSON.parse(item.text),

          createdAt:
            item.createdAt,
        }));

      res.json(formatted);

    } catch (error) {

      console.log(
        "GET SUMMARIES ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

/* ---------------- GET SUMMARY BY CASE ---------------- */

router.get(
  "/summary/:caseId",
  authMiddleware,
  async (req, res) => {
    try {

      const { caseId } =
        req.params;

      const summary =
        await Summary.findOne({
          caseId,
          userId: req.userId,
        });

      if (!summary) {
        return res.status(404).json({
          error: "Summary not found",
        });
      }

      res.json({
        caseId,

        summary:
          JSON.parse(summary.text),
      });

    } catch (error) {

      console.log(
        "GET SUMMARY ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);
router.post(
  "/translate",
  authMiddleware,
  async (req, res) => {
    try {
      console.log("T1");
      const {
        caseId,
        summary,
        language,
      } = req.body;
      console.log("T2", caseId, summary, language);
      if (!summary || !language) {
        return res.status(400).json({
          error:
            "Summary and language are required",
        });
      }

      const prompt = `
Translate the following legal summary into ${language}.

Keep the structure exactly the same.
Translate all content accurately.

Summary:
${JSON.stringify(summary, null, 2)}

Return ONLY valid JSON.
`;
      console.log("T3");
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
console.log("T4");
      const rawText =
        aiResponse.choices[0].message.content;

      const cleanJson = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let translatedSummary;

      try {

        translatedSummary =
          JSON.parse(cleanJson);
        console.log("TRANSLATED SUMMARY:", translatedSummary);
      } catch {

        return res.status(500).json({
          error:
            "Translation parsing failed",
        });
      }

      // SAVE TRANSLATION

      const newTranslation =
        new Translation({
          userId: req.userId,

          caseId,

          language,

          translatedText:
            JSON.stringify(
              translatedSummary
            ),
        });

      await newTranslation.save();

      res.json({
        translation:
          translatedSummary,
      });

    }  catch (error) {

  console.log("========== TRANSLATION ERROR ==========");
console.log(error);
console.log("MESSAGE:", error?.message);
console.log("ERRORS:", error?.errors);
console.log("STACK:", error?.stack);
console.log("======================================");
    }
  }
);
/* ---------------- TEXT SUMMARIZER ---------------- */

router.post(
  "/summarize-text",
  authMiddleware,
  async (req, res) => {
    try {

      const { content } =
        req.body;

      if (!content) {
        return res.status(400).json({
          error:
            "No content provided",
        });
      }

      const prompt = `
Analyze this legal text and return ONLY valid JSON.

Format:

{
  "facts": [],
  "issues": [],
  "judgement": "",
  "legalPrinciples": []
}

Legal Text:
${content}
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

        parsedSummary =
          JSON.parse(cleanJson);

      } catch (parseError) {

        console.log(
          "SUMMARY PARSE ERROR:",
          parseError
        );

        parsedSummary = {
          facts: [],
          issues: [],
          judgement: rawText,
          legalPrinciples: [],
        };
      }

      res.json({
        summary: parsedSummary,
      });

    } catch (error) {

      console.log(
        "TEXT SUMMARY ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;