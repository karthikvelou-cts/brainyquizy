import mongoose from "mongoose";

const quizScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quizConfig: {
      amount: { type: Number, default: 10 },
      category: { type: String, default: "" },
      difficulty: { type: String, enum: ["", "easy", "medium", "hard"], default: "" },
      type: { type: String, enum: ["", "multiple", "boolean"], default: "" },
      page: { type: Number, default: 1 },
      limit: { type: Number, default: 10 },
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    wrongAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    proctoring: {
      enabled: { type: Boolean, default: false },
      terminatedForMalpractice: { type: Boolean, default: false },
      violations: [
        {
          type: { type: String, required: true },
          message: { type: String, required: true },
          at: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("QuizScore", quizScoreSchema);
