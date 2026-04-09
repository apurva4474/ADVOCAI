const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true
  },
  filename: String,
  content: String
});

module.exports = mongoose.model("Document", documentSchema);