import express from "express";
import { submitFeedback } from "../controller/feedbackController.js";

const router = express.Router();

router.post("/feedback", submitFeedback);

export default router;