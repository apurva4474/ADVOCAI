const express = require("express");
const Groq = require("groq-sdk");

const Summary = require("../models/Summary");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post(
  "/case-chat",
  authMiddleware,
  async (req, res) => {
    try {

      const {
        caseId,
        question,
      } = req.body;

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

      const prompt = `
You are ADVOCAI, an AI legal assistant.

Case Summary:
${summary.text}

Answer ONLY based on the case information provided.

Question:
${question}
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

      res.json({
        answer:
          aiResponse.choices[0]
            .message.content,
      });

    } catch (error) {

      console.log(
        "CASE CHAT ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;