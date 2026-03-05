import crypto from "crypto";
import { param } from "express-validator";
import Token from "../models/Token.js";
import { opentdbResponse } from "../utils/helpers.js";

const tokenTtlHours = Number(process.env.TOKEN_TTL_HOURS || 6);

export const tokenParamValidator = [
  param("token").isLength({ min: 20 }).withMessage("Invalid token format"),
];

export const generateSessionToken = async (req, res) => {
  const rawToken = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + tokenTtlHours * 60 * 60 * 1000);

  const tokenDoc = await Token.create({
    token: rawToken,
    user: req.user._id,
    expiresAt,
  });

  return res.status(201).json({
    response_code: 0,
    token: tokenDoc.token,
    expiresAt: tokenDoc.expiresAt,
  });
};

export const deleteSessionToken = async (req, res) => {
  const deleted = await Token.findOneAndDelete({
    token: req.params.token,
    user: req.user._id,
  });

  if (!deleted) {
    return res.status(404).json(opentdbResponse([], 3, { message: "Token not found" }));
  }

  return res.status(200).json(opentdbResponse([], 0, { message: "Token deleted" }));
};
