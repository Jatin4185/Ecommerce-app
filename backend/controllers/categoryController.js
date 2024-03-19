import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required...");
  }

  const categoryExits = await Category.findOne({ name });

  if (categoryExits) {
    res.status(400);
    throw new Error("Category already exits...");
  }

  const category = await Category.create({ name });

  if (category) {
    res.status(201).json({
      id: category._id,
      name: category.name,
    });
  } else {
    res.status(500);
    throw new Error("Error in creating category...");
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(404);
    throw new Error("Category is not created yet...");
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (category) {
    res.status(200).json("Category deleted...");
  } else {
    res.status(404);
    throw new Error(`Category not found...`);
  }
});

//update function is not implemented yet

export { createCategory, getAllCategory, deleteCategory };
