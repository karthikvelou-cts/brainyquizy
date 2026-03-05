import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Question from "../models/Question.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Category.deleteMany(), Question.deleteMany()]);

  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);
  const admin = await User.create({
    username: process.env.ADMIN_USERNAME || "admin",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: adminPassword,
    role: "admin",
  });

  const categories = await Category.insertMany([
    { name: "General Knowledge", description: "General trivia" },
    { name: "Science", description: "Science and nature" },
    { name: "History", description: "Historical events" },
  ]);

  await Question.insertMany([
    {
      category: categories[0]._id,
      type: "multiple",
      difficulty: "easy",
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["Rome", "Berlin", "Madrid"],
      createdBy: admin._id,
    },
    {
      category: categories[1]._id,
      type: "boolean",
      difficulty: "easy",
      question: "The chemical symbol for water is H2O.",
      correct_answer: "True",
      incorrect_answers: ["False"],
      createdBy: admin._id,
    },
    {
      category: categories[2]._id,
      type: "multiple",
      difficulty: "medium",
      question: "In which year did World War II end?",
      correct_answer: "1945",
      incorrect_answers: ["1939", "1944", "1946"],
      createdBy: admin._id,
    },
  ]);

  console.log("Seed completed");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
