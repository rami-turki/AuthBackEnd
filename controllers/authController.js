const express = require("express");
const asyncHandler = require("express-async-handler");
const { User, loginValidate, registerValidate, updateUserValidate } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();





const loginUser = asyncHandler(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).json({ message: 'this email is not registerd' });
    }
    const { error } = loginValidate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        res.status(400).json({ message: "password don`t match!" });
    }
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
});

const registerNewUser = asyncHandler(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).json({ message: "this user is already registerd" });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = new User({
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password
    });
    const result = await user.save();
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    if (!users) {
        res.status(404).json({ message: "no users found" });
    }
    res.status(200).json({ users });
});

const getSpecifcUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
    const { error } = updateUserValidate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            password: req.body.password,
            userName: req.body.userName
        },
    }, { new: true }).select("-password");
    res.status(200).json({ updateUser });
});



module.exports = {
    loginUser,
    registerNewUser,
    getAllUsers,
    updateUser,
    getSpecifcUser
}