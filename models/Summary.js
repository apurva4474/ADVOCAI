const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  caseId: String,
  filename: String,
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Summary", summarySchema);