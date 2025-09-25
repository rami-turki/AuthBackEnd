const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

function checkAuthAdmin(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (req.user.isAdmin) { next(); } else {
                res.status(400).json({ message: "user is not admin" });
            }
        } catch (error) {
            res.status(400).json({ message: "invalid token" })
        }
    }
    else {
        res.status(404).json({ message: "no token provided" });
    }
}

module.exports = {
    checkAuthAdmin
}