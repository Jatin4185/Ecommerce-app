import express from "express";
const router = express.Router();

import {
  createProduct,
  fetchProducts,
  deleteProductById,
  updateProductById,
} from "../controllers/ProductConroller.js";
import {
  adminAuthorization,
  authenticate,
} from "../middlewares/authenticationMiddleware.js";

router
  .route("/")
  .post(authenticate, adminAuthorization, createProduct)
  .get(fetchProducts);
router
  .route("/:id")
  .delete(authenticate, adminAuthorization, deleteProductById)
  .put(authenticate, adminAuthorization, updateProductById);
export default router;
