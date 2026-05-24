const express = require("express");

const Groq = require("groq-sdk");

const Summary = require("../models/Summary");
const Argument = require("../models/Argument");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ---------------- GENERATE ARGUMENTS ---------------- */

router.post(
  "/generate-arguments",
  authMiddleware,
  async (req, res) => {
    try {
      const { caseId } = req.body;

      const summary =
        await Summary.findOne({
          caseId,
        });

      if (!summary) {
        return res.status(404).json({
          error: "Summary not found",
        });
      }

      const parsedSummary =
        JSON.parse(summary.text);

      const prompt = `
Analyze this legal case and return ONLY valid JSON.

Format:

{
  "plaintiffArguments": [],
  "defendantArguments": [],
  "keyLegalPoints": []
}

Case Summary:
${JSON.stringify(parsedSummary)}
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

      let parsedArguments = {};

      try {

        parsedArguments =
          JSON.parse(cleanJson);

      } catch (parseError) {

        console.log(
          "ARGUMENT JSON ERROR:",
          parseError
        );

        parsedArguments = {
          plaintiffArguments: [],
          defendantArguments: [],
          keyLegalPoints: [],
        };
      }

      // SAVE ARGUMENTS

      const newArgument =
        new Argument({
          userId: req.userId,
          caseId,

          argumentsData:
            
              parsedArguments,
        });

      await newArgument.save();

      res.json({
        caseId,
        arguments: parsedArguments,
      });

    } catch (error) {

      console.log(
        "GENERATE ARGUMENT ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

/* ---------------- GET ARGUMENT HISTORY ---------------- */

router.get(
  "/arguments-history",
  authMiddleware,
  async (req, res) => {
    try {

      const argumentsList =
        await Argument.find({
          userId: req.userId,
        }).sort({
          createdAt: -1,
        });

      const formatted =
        argumentsList.map((item) => ({
          _id: item._id,

          caseId: item.caseId,

          arguments:
            
              item.argumentsData,

          createdAt: item.createdAt,
        }));

      res.json(formatted);

    } catch (error) {

      console.log(
        "GET ARGUMENT HISTORY ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;