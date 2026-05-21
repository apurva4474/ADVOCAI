const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/generate-timeline", async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Extract important legal case events and dates from the following case document.

Return ONLY valid JSON array format like:
[
  {
    "date": "2021-01-12",
    "event": "FIR registered"
  }
]

Case Text:
${text}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.2,
    });

    const response =
      completion.choices[0]?.message?.content || "[]";

    const cleanJson = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const timeline = JSON.parse(cleanJson);

    res.json(timeline);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Timeline generation failed",
    });
  }
});

module.exports = router;