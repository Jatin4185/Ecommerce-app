import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

//register user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //check all credential are present
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required....");
  }

  //check if user already exits in database
  const exitingUser = await User.findOne({ email });

  if (exitingUser) {
    res.status(400);
    throw new Error("User already exits...");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create new User
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    generateToken(res, newUser._id);
    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user details");
  }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check credential are present
  if (!email || !password) {
    res.status(400);
    throw new Error("Username or password required...");
  }

  const userExits = await User.findOne({ email });

  if (!userExits) {
    res.status(404);
    throw new Error("User not found...");
  }

  const isMatched = await bcrypt.compare(password, userExits.password);

  if (isMatched) {
    generateToken(res, userExits._id);
    res.status(200).json({
      id: userExits._id,
      username: userExits.username,
      email: userExits.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//logoutUser
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successfully." });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  };
  res.status(200).json(user);
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updateUser = await user.save();
    res.status(200).json({
      id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error("Users not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user) {
    res.status(204).json({ message: "User deletion successfull." });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});
export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUserById,
};
