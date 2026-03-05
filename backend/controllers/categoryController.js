import { body, param } from "express-validator";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import { getPagination } from "../utils/helpers.js";

export const categoryValidators = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

export const categoryIdValidator = [
  param("id").isMongoId().withMessage("Invalid category id"),
];

export const getCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, ...meta } = getPagination(page, limit, 50);

  const [categories, total] = await Promise.all([
    Category.find().sort({ name: 1 }).skip(skip).limit(meta.limit),
    Category.countDocuments(),
  ]);

  return res.status(200).json({
    data: categories,
    pagination: {
      ...meta,
      total,
      totalPages: Math.ceil(total / meta.limit),
    },
  });
};

export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  return res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.status(200).json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const count = await Question.countDocuments({ category: category._id });
  if (count > 0) {
    return res.status(400).json({
      message: "Cannot delete category with existing questions",
    });
  }

  await category.deleteOne();
  return res.status(204).send();
};
