const express = require("express");

const Groq = require("groq-sdk");

const Timeline = require("../models/Timeline");

const Summary = require("../models/Summary");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ---------------- GENERATE TIMELINE ---------------- */

router.post(
  "/generate-timeline",
  authMiddleware,
  async (req, res) => {
    try {

      const { caseId } = req.body;

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

      const parsedSummary =
        JSON.parse(summary.text);

      const prompt = `
Extract important legal events and dates.

Return ONLY valid JSON array format.

Example:

[
  {
    "date":"2021-01-12",
    "event":"FIR registered"
  }
]

Case Summary:
${JSON.stringify(parsedSummary)}
`;

      const completion =
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

      const response =
        completion?.choices?.[0]
          ?.message?.content;

      if (!response) {
        return res.status(500).json({
          error: "No AI response",
        });
      }

      const cleanJson = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedTimeline = [];

      try {

        parsedTimeline =
          JSON.parse(cleanJson);

      } catch (parseError) {

        console.log(
          "TIMELINE JSON ERROR:",
          parseError
        );

        parsedTimeline = [];
      }

      // SAVE TIMELINE

      const newTimeline =
        new Timeline({
          userId: req.userId,

          caseId,

          timelineData:
            
              parsedTimeline,
        });

      await newTimeline.save();

      res.json({
        caseId,
        timeline: parsedTimeline,
      });

    } catch (error) {

      console.log(
        "TIMELINE ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

/* ---------------- GET TIMELINE HISTORY ---------------- */

router.get(
  "/timeline-history",
  authMiddleware,
  async (req, res) => {
    try {

      const timelines =
        await Timeline.find({
          userId: req.userId,
        }).sort({
          createdAt: -1,
        });

      const formatted =
        timelines.map((item) => ({
          _id: item._id,

          caseId: item.caseId,

          timeline:
            
              item.timelineData,
      

          createdAt:
            item.createdAt,
        }));

      res.json(formatted);

    } catch (error) {

      console.log(
        "GET TIMELINES ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);
router.get(
  "/timeline/:caseId",

  authMiddleware,

  async (req, res) => {

    try {

      const timeline =
        await Timeline.findOne({

          caseId:
            req.params.caseId,

          userId:
            req.userId,
        });

      if (!timeline) {

        return res.status(404).json({
          error:
            "Timeline not found",
        });
      }

      res.json({
        timeline:
          timeline.timelineData,
      });

    } catch (error) {

      console.log(
        "GET TIMELINE ERROR:",
        error
      );

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);
module.exports = router;