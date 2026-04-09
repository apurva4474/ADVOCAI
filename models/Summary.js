const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite (your fix is correct 👍)
module.exports =
  mongoose.models.Summary || mongoose.model("Summary", summarySchema);