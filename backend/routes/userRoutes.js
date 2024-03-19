import express from "express";
const router = express.Router();

import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUserById,
} from "../controllers/userController.js";
import {
  adminAuthorization,
  authenticate,
} from "../middlewares/authenticationMiddleware.js";

router
  .route("/")
  .post(createUser)
  .get(authenticate, adminAuthorization, getAllUsers);

router.post("/auth", loginUser);

router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

router
  .route("/:id")
  .get(authenticate, adminAuthorization, getUserById)
  .delete(authenticate, adminAuthorization, deleteUserById);

export default router;
