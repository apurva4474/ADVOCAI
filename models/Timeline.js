const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
  documentName: String,
  timeline: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Timeline", timelineSchema);