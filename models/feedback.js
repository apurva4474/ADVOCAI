const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);