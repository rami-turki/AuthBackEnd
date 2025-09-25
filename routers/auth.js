const express = require("express");
const mongoose = require("mongoose");
const { User, loginValidate, registerValidate, updateUserValidate } = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { checkAuthAdmin } = require("../middlewares/checkAuthAdmin");
const { loginUser, registerNewUser, getAllUsers, updateUser, getSpecifcUser } = require("../controllers/authController");

// register user
router.post("/register", registerNewUser);


// login user
router.post("/login", loginUser);


// get all users
router.get("/users", checkAuthAdmin, getAllUsers);

router.patch("/user/:id", updateUser);
router.get("/user/:id", getSpecifcUser);

module.exports = router;