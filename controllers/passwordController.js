const express = require("express");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();




const sendEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).json({ message: "email not found" });
    }
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "1h",
    });
    const link = `http://localhost:8000/password/reset-password/${user._id}/${token}`;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NOTI_EMAIL,
            pass: process.env.NOTI_PASS
        },
    });
    const mailOption = {
        from: process.env.NOTI_EMAIL,
        to: user.email,
        subject: "reset pass",
        html: `<div>
        <h4>Click on the link below to reset your passwor </h4>
        <p>${link} </p>
         </div>`
    };
    transporter.sendMail(mailOption, (err, success) => {
        if (err) {
            res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: "email sent succefully", success });
    });
});

module.exports = {
    sendEmail
}