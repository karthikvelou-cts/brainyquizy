import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  getQuestionsValidators,
  importQuestions,
  questionIdValidator,
  questionUpdateValidators,
  questionValidators,
  updateQuestion,
} from "../controllers/questionController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getQuestionsValidators, validateRequest, getQuestions);
router.post("/", protect, adminOnly, questionValidators, validateRequest, createQuestion);
router.put("/:id", protect, adminOnly, questionIdValidator, questionUpdateValidators, validateRequest, updateQuestion);
router.delete("/:id", protect, adminOnly, questionIdValidator, validateRequest, deleteQuestion);
router.post("/import", protect, adminOnly, validateRequest, importQuestions);

export default router;
