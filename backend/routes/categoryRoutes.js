import express from "express";
const router = express.Router();

import {
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controllers/categoryController.js";
import {
  adminAuthorization,
  authenticate,
} from "../middlewares/authenticationMiddleware.js";

router
  .route("/")
  .post(authenticate, adminAuthorization, createCategory)
  .get(getAllCategory);
router.route("/:id").delete(authenticate, adminAuthorization, deleteCategory);

export default router;
