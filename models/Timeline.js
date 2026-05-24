const mongoose =
  require("mongoose");

const timelineSchema =
  new mongoose.Schema({

    userId: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    caseId: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Case",

      required: true,
    },

    timelineData: {
      type: Array,

      required: true,
    },

    createdAt: {
      type: Date,

      default: Date.now,
    },
  });

module.exports =
  mongoose.models.Timeline ||

  mongoose.model(
    "Timeline",
    timelineSchema
  );