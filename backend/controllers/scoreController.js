import { body, query } from "express-validator";
import QuizScore from "../models/QuizScore.js";

export const submitScoreValidators = [
  body("quizConfig").optional().isObject().withMessage("quizConfig must be an object"),
  body("quizConfig.amount").optional({ values: "falsy" }).isInt({ min: 1, max: 50 }),
  body("quizConfig.category").optional({ values: "falsy" }).isString(),
  body("quizConfig.difficulty").optional({ values: "falsy" }).isIn(["easy", "medium", "hard"]),
  body("quizConfig.type").optional({ values: "falsy" }).isIn(["multiple", "boolean"]),
  body("quizConfig.page").optional({ values: "falsy" }).isInt({ min: 1 }),
  body("quizConfig.limit").optional({ values: "falsy" }).isInt({ min: 1, max: 50 }),
  body("proctoring").optional().isObject().withMessage("proctoring must be an object"),
  body("proctoring.enabled").optional().isBoolean(),
  body("proctoring.terminatedForMalpractice").optional().isBoolean(),
  body("proctoring.violations").optional().isArray(),
  body("totalQuestions").isInt({ min: 0 }).withMessage("totalQuestions is required"),
  body("correctAnswers").isInt({ min: 0 }).withMessage("correctAnswers is required"),
  body("wrongAnswers").isInt({ min: 0 }).withMessage("wrongAnswers is required"),
  body("score").isNumeric().withMessage("score is required"),
  body("maxScore").isNumeric().withMessage("maxScore is required"),
];

export const historyValidators = [
  query("page").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional({ values: "falsy" }).isInt({ min: 1, max: 50 }).withMessage("limit must be 1..50"),
];

export const submitQuizScore = async (req, res) => {
  const {
    quizConfig = {},
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    score,
    maxScore,
    proctoring = {},
  } = req.body;

  const normalizedTotal = Number(totalQuestions);
  const normalizedCorrect = Number(correctAnswers);
  const normalizedWrong = Number(wrongAnswers);
  const normalizedScore = Number(score);
  const normalizedMaxScore = Number(maxScore);

  if (normalizedCorrect + normalizedWrong !== normalizedTotal) {
    return res.status(400).json({ message: "correctAnswers + wrongAnswers must equal totalQuestions" });
  }
  if (normalizedScore > normalizedMaxScore) {
    return res.status(400).json({ message: "score cannot exceed maxScore" });
  }

  const percentage = normalizedMaxScore > 0
    ? Number(((normalizedScore / normalizedMaxScore) * 100).toFixed(2))
    : 0;

  const created = await QuizScore.create({
    user: req.user._id,
    quizConfig: {
      amount: quizConfig.amount || 10,
      category: quizConfig.category || "",
      difficulty: quizConfig.difficulty || "",
      type: quizConfig.type || "",
      page: quizConfig.page || 1,
      limit: quizConfig.limit || 10,
    },
    totalQuestions: normalizedTotal,
    correctAnswers: normalizedCorrect,
    wrongAnswers: normalizedWrong,
    score: normalizedScore,
    maxScore: normalizedMaxScore,
    percentage,
    proctoring: {
      enabled: Boolean(proctoring.enabled),
      terminatedForMalpractice: Boolean(proctoring.terminatedForMalpractice),
      violations: Array.isArray(proctoring.violations)
        ? proctoring.violations
            .filter((v) => v?.type && v?.message)
            .map((v) => ({
              type: String(v.type),
              message: String(v.message),
              at: v.at ? new Date(v.at) : new Date(),
            }))
        : [],
    },
  });

  return res.status(201).json({
    message: "Quiz score saved",
    data: created,
  });
};

export const getMyQuizScores = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    QuizScore.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    QuizScore.countDocuments({ user: req.user._id }),
  ]);

  return res.status(200).json({
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
