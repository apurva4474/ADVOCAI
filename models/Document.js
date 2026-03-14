const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Document", documentSchema);