import express from "express";
import {
  categoryIdValidator,
  categoryValidators,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, categoryValidators, validateRequest, createCategory);
router.put("/:id", protect, adminOnly, categoryIdValidator, categoryValidators, validateRequest, updateCategory);
router.delete("/:id", protect, adminOnly, categoryIdValidator, validateRequest, deleteCategory);

export default router;
