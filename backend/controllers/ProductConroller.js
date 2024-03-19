import Product from "../models/Product.js";
import Category from "../models/Category.js";

import asyncHandler from "express-async-handler";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    quantity,
    price,
    discount,
    image,
    brand,
    category,
  } = req.body;

  switch (true) {
    case !name:
      return res.json({ error: "Product name is required..." });
    case !description:
      return res.json({ error: "Product description is required..." });
    case !quantity:
      return res.json({ error: "Product quantity is required..." });
    case !price:
      return res.json({ error: "Product price is required..." });
    case !image:
      return res.json({ error: "Product image is required..." });
    case !brand:
      return res.json({ error: "Product brand is required..." });
    case !category:
      return res.json({ error: "Product category is required..." });
  }

  const categoryExits = await Category.findOne({ name: category });

  if (!categoryExits) {
    res.status(404);
    throw new Error("Category is not found...");
  }

  const productExits = await Product.findOne({ name, description });
  if (productExits) {
    res.status(400);
    throw new Error("Product already exits");
  }

  const product = await Product.create({
    name,
    description,
    quantity,
    price,
    discount,
    image,
    brand,
    category: categoryExits._id,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Error in product creation...");
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "asc";
  const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 2;

  const skip = (pageNumber - 1) * pageSize;

  const totalProducts = await Product.countDocuments({});
  const totalPages = Math.ceil(totalProducts / pageSize);

  const products = await Product.find({})
    .populate("category")
    .sort({
      [sortBy]: sortOrder == "asc" ? 1 : -1,
    })
    .skip(skip)
    .limit(pageSize);

  if (products.length) {
    res.status(200).json({
      pageNumber,
      pageSize,
      totalPages,
      products,
    });
  } else {
    res.status(400);
    throw new Error("Products are not found...");
  }
});

const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.status(200).json("Product deleted...");
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

const updateProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.quantity = req.body.quantity || product.quantity;
    product.price = req.body.price || product.price;
    product.discount = req.body.discount || product.discount;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;

    if (req.body.category) {
      const category = await Category.findOne({ name: req.body.category });
      if (!category) {
        res.status(404);
        throw new Error("Category not found...");
      } else {
        product.category = category._id;
      }
    }

    const newProduct = await product.save();
    res.status(200).json(newProduct);
  } else {
    res.status(404);
    throw new Error("Product not found...");
  }
});

export { createProduct, fetchProducts, deleteProductById, updateProductById };
