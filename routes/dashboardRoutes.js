const express = require("express");

const Case = require("../models/Case");
const Summary = require("../models/Summary");

// OPTIONAL
// const Argument = require("../models/Argument");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

/* ---------------- DASHBOARD STATS ---------------- */

router.get(
  "/dashboard-stats",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.userId;

      const totalCases =
        await Case.countDocuments({
          userId,
        });

      const totalSummaries =
        await Summary.countDocuments({
          userId,
        });

      // TEMPORARY
      const totalArguments = 0;

      // LATER:
      // const totalArguments =
      //   await Argument.countDocuments({
      //     userId,
      //   });

      res.json({
        cases: totalCases,
        summaries: totalSummaries,
        arguments: totalArguments,
      });

    } catch (error) {
      console.log(
        "DASHBOARD STATS ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;