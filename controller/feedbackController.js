import Feedback from "../models/feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};