const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const User = mongoose.model('Users', userSchema);

function loginValidate(obj) {
    const schema = Joi.object({
        email: Joi.string().required().trim().email(),
        password: Joi.string().required().trim(),
        userName: Joi.string().trim(),
        isAdmin: Joi.bool(),
    });
    return schema.validate(obj);
}

function registerValidate(obj) {
    const schema = Joi.object({
        email: Joi.string().required().email().trim(),
        password: Joi.string().required().trim(),
        userName: Joi.string().required().trim(),
        isAdmin: Joi.bool(),
    });
    return schema.validate(obj);
}

function updateUserValidate(obj) {
    const schema = Joi.object({
        email: Joi.string().email().trim(),
        password: Joi.string().trim(),
        userName: Joi.string().trim()
    });
    return schema.validate(obj);
}

module.exports = {
    User, loginValidate, registerValidate, updateUserValidate
}