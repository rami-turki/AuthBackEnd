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
        return res.status(404).json({ message: "email not found" });
    }
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "1h",
    });
    const link = `https://authbackend-p23g.onrender.com/password/reset-password/${user._id}/${token}`;
    const transporter = nodemailer.createTransport({
        // 1. حدد المضيف والمنفذ والبروتوكول يدوياً
        host: "smtp.gmail.com",
        port: 465, // منفذ SSL/TLS
        secure: true, // ⚠️ إلزامي للمنفذ 465

        auth: {
            user: process.env.NOTI_EMAIL,
            pass: process.env.NOTI_PASS // (App Password)
        },

        // 2. 🛡️ أضف هذا الخيار الإضافي لمعالجة مشاكل TLS/SSL في البيئات السحابية
        tls: {
            // يسمح بالاتصال حتى لو كان هناك مشكلة في التحقق من شهادة السيرفر
            // هذا ليس الحل المثالي للإنتاج، لكنه يحل مشاكل بيئة العمل الفورية
            rejectUnauthorized: false
        }
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
    // transporter.sendMail(mailOption, (err, success) => {
    //     if (err) {
    //         return res.status(400).json({ message: err.message });
    //     }
    //     return res.status(200).json({ message: "email sent succefully", success });
    // });
    try {
        const info = await transporter.sendMail(mailOption);
        return res.status(200).json({
            message: "email sent succefully",
            success: info
        });
    } catch (error) {
        console.error('NodeMailer failed on Render', error);
        return res.status(500).json({
            message: "Failed to send email. Check Nodemailer logs/config",
            details: error.message
        });
    }
});

module.exports = {
    sendEmail
}