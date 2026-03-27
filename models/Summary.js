const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  caseId: String,
  filename: String,
  summary: String,
}, { timestamps: true });

// 🔥 THIS LINE FIXES CACHE ISSUE
module.exports = mongoose.models.Summary || mongoose.model("Summary", summarySchema);