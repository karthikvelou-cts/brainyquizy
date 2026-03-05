import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["multiple", "boolean"],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    correct_answer: {
      type: String,
      required: true,
      trim: true,
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: {
        validator: function (answers) {
          if (this.type === "boolean") {
            return answers.length === 1;
          }
          return answers.length >= 1;
        },
        message: "Invalid incorrect answers for question type",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Question", questionSchema);
