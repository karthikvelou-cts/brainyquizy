import express from "express";
import { login, loginValidators, register, registerValidators } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/register", registerValidators, validateRequest, register);
router.post("/login", loginValidators, validateRequest, login);

export default router;
