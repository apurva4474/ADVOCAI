// const Feedback = require("../models/Feedback");

// exports.createFeedback = async (req, res) => {
//   try {
//     const feedback = new Feedback(req.body);
//     await feedback.save();
//     res.status(201).json({ message: "Feedback saved" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };