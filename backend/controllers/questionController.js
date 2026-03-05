import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import Question from "../models/Question.js";
import Category from "../models/Category.js";
import Token from "../models/Token.js";
import { getPagination, opentdbResponse, parseAmount } from "../utils/helpers.js";

const transformQuestion = (questionDoc) => ({
  _id: questionDoc._id,
  category: questionDoc.category?.name || "Unknown",
  categoryId: questionDoc.category?._id,
  type: questionDoc.type,
  difficulty: questionDoc.difficulty,
  question: questionDoc.question,
  correct_answer: questionDoc.correct_answer,
  incorrect_answers: questionDoc.incorrect_answers,
});

export const questionValidators = [
  body("category").isMongoId().withMessage("Valid category id is required"),
  body("type").isIn(["multiple", "boolean"]).withMessage("Invalid question type"),
  body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty"),
  body("question").trim().notEmpty().withMessage("Question text is required"),
  body("correct_answer").trim().notEmpty().withMessage("Correct answer is required"),
  body("incorrect_answers").isArray({ min: 1 }).withMessage("Incorrect answers must be a non-empty array"),
];

export const questionUpdateValidators = [
  body("category").optional().isMongoId().withMessage("Valid category id is required"),
  body("type").optional().isIn(["multiple", "boolean"]).withMessage("Invalid question type"),
  body("difficulty").optional().isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty"),
  body("question").optional().trim().notEmpty().withMessage("Question text cannot be empty"),
  body("correct_answer").optional().trim().notEmpty().withMessage("Correct answer cannot be empty"),
  body("incorrect_answers").optional().isArray({ min: 1 }).withMessage("Incorrect answers must be a non-empty array"),
];

export const questionIdValidator = [param("id").isMongoId().withMessage("Invalid question id")];

export const getQuestionsValidators = [
  query("amount").optional().isInt({ min: 1, max: 50 }).withMessage("amount must be between 1 and 50"),
  query("category").optional().custom((value) => mongoose.Types.ObjectId.isValid(value) || value === "any").withMessage("Invalid category"),
  query("difficulty").optional().isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty"),
  query("type").optional().isIn(["multiple", "boolean"]).withMessage("Invalid type"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be 1..50"),
];

const validateOpenToken = async (token) => {
  if (!token) return true;

  const tokenDoc = await Token.findOne({ token });
  if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
    return false;
  }
  return true;
};

export const getQuestions = async (req, res) => {
  const {
    amount = 10,
    category,
    difficulty,
    type,
    page = 1,
    limit = 10,
    token,
  } = req.query;

  const isTokenValid = await validateOpenToken(token);
  if (!isTokenValid) {
    return res.status(401).json(opentdbResponse([], 3, { message: "Invalid or expired session token" }));
  }

  const filter = {};

  if (category && category !== "any") {
    const exists = await Category.exists({ _id: category });
    if (!exists) {
      return res.status(400).json(opentdbResponse([], 1, { message: "Invalid category" }));
    }
    filter.category = category;
  }
  if (difficulty) filter.difficulty = difficulty;
  if (type) filter.type = type;

  const requestedAmount = parseAmount(amount, 50);
  const { skip, ...meta } = getPagination(page, limit, 50);

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(meta.limit, requestedAmount)),
    Question.countDocuments(filter),
  ]);

  const results = questions.map(transformQuestion);
  const responseCode = results.length > 0 ? 0 : 1;

  return res.status(200).json(
    opentdbResponse(results, responseCode, {
      pagination: {
        ...meta,
        total,
        totalPages: Math.ceil(total / meta.limit),
      },
    })
  );
};

export const createQuestion = async (req, res) => {
  const categoryExists = await Category.exists({ _id: req.body.category });
  if (!categoryExists) {
    return res.status(400).json({ message: "Category does not exist" });
  }

  const payload = {
    ...req.body,
    createdBy: req.user._id,
  };

  if (payload.type === "boolean" && payload.incorrect_answers.length !== 1) {
    return res.status(400).json({
      message: "Boolean questions must contain exactly one incorrect answer",
    });
  }

  const question = await Question.create(payload);
  const populated = await question.populate("category", "name");

  return res.status(201).json(populated);
};

export const updateQuestion = async (req, res) => {
  const existing = await Question.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: "Question not found" });
  }

  if (req.body.category) {
    const categoryExists = await Category.exists({ _id: req.body.category });
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }
  }

  const nextType = req.body.type || existing.type;
  const nextIncorrectAnswers = req.body.incorrect_answers || existing.incorrect_answers;

  if (nextType === "boolean" && nextIncorrectAnswers.length !== 1) {
    return res.status(400).json({ message: "Boolean questions must include one incorrect answer" });
  }

  Object.assign(existing, req.body);
  await existing.save();
  await existing.populate("category", "name");

  return res.status(200).json(existing);
};

export const deleteQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  await question.deleteOne();
  return res.status(204).send();
};

export const importQuestions = async (req, res) => {
  const { questions = [] } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "questions array is required" });
  }

  const categoryMap = new Map();
  const docs = [];

  for (const q of questions) {
    let categoryId = q.category;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      const key = (q.categoryName || "General").trim();
      if (!categoryMap.has(key)) {
        let cat = await Category.findOne({ name: key });
        if (!cat) {
          cat = await Category.create({ name: key, description: `${key} questions` });
        }
        categoryMap.set(key, cat._id);
      }
      categoryId = categoryMap.get(key);
    }

    docs.push({
      category: categoryId,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      createdBy: req.user._id,
    });
  }

  const inserted = await Question.insertMany(docs, { ordered: false });

  return res.status(201).json({
    message: "Questions imported",
    count: inserted.length,
  });
};
