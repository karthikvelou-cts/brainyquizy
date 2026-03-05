import express from "express";
import {
  deleteSessionToken,
  generateSessionToken,
  tokenParamValidator,
} from "../controllers/tokenController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, generateSessionToken);
router.delete("/:token", protect, tokenParamValidator, validateRequest, deleteSessionToken);

export default router;
