import express from "express";
import {
  getMyQuizScores,
  historyValidators,
  submitQuizScore,
  submitScoreValidators,
} from "../controllers/scoreController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/my", protect, submitScoreValidators, validateRequest, submitQuizScore);
router.get("/my", protect, historyValidators, validateRequest, getMyQuizScores);

export default router;
