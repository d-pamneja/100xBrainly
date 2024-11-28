"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.verifyUser = exports.login = exports.signUp = void 0;
const model_1 = require("../../db/model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const constants_1 = require("../../utils/constants");
const signUp = async function (req, res) {
    try {
        const requestBody = req.body;
        const username = requestBody.username;
        const password = requestBody.password;
        const hashedPassword = await bcrypt_1.default.hash(password, 5);
        const response = await model_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        if (!response) {
            res.status(403).json({ message: `User with name ${username} exists.` });
        }
        res.status(201).json({ message: `New user with ${username} created successfully.` });
    }
    catch (error) {
        if (error.errorResponse.code == 11000) {
            res.status(500).json({ message: `Username already exists. Kindly login` });
        }
        else {
            res.status(500).json({ message: `Error at backend with error : ${error.message}` });
        }
    }
};
exports.signUp = signUp;
const login = async function (req, res) {
    try {
        const requestBody = req.body;
        const username = requestBody.username;
        const password = requestBody.password;
        const response = await model_1.UserModel.findOne({
            username: username
        });
        if (!response) {
            res.status(403).json({ message: "Incorrect username" });
            return;
        }
        const passwordMatch = await bcrypt_1.default.compare(password, response.password);
        if (passwordMatch) {
            const token = jsonwebtoken_1.default.sign({
                Id: response._id.toString()
            }, JWT_SECRET);
            const oldToken = req.signedCookies[`${constants_1.COOKIE_NAME}`];
            if (oldToken) {
                res.clearCookie(constants_1.COOKIE_NAME);
            }
            const expiresInMilliseconds = 7 * 24 * 60 * 60 * 1000;
            const expires = new Date(Date.now() + expiresInMilliseconds);
            res.cookie(constants_1.COOKIE_NAME, token, {
                path: "/",
                expires,
                signed: true,
                secure: true
            });
            return res.status(200).json({ message: `${username} has been successfully logged in.`, id: response._id.toString() });
        }
        else {
            res.status(403).json({ message: "Incorrect password." });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error at backend with error : ${error.message}` });
    }
};
exports.login = login;
const verifyUser = async (req, res, next) => {
    try {
        if (!res.locals.jwtData) {
            return res.status(403).json({ message: "Not authorised." });
        }
        const existingUser = await model_1.UserModel.findById(res.locals.jwtData);
        if (!existingUser) {
            return res.status(401).json({
                message: "User not registered or Token malfunctioned."
            });
        }
        if (existingUser._id.toString() != res.locals.jwtData) {
            return res.status(401).send("Permissions did not match.");
        }
        return res.status(200).json({
            message: "User successfully verified.",
            id: existingUser._id.toString(),
            username: existingUser.username
        });
    }
    catch (error) {
        console.log(`Error in logging in user : ${error.message}`);
        return res.status(500).json({
            message: "Error in verifying in user",
            reason: error.message
        });
    }
};
exports.verifyUser = verifyUser;
const logout = async (req, res, next) => {
    try {
        res.clearCookie(constants_1.COOKIE_NAME);
        return res.status(200).json({
            message: "User successfully logged out."
        });
    }
    catch (error) {
        console.log(`Error in logging out user : ${error.message}`);
        return res.status(500).json({
            message: "Error in logging in user",
            reason: error.message
        });
    }
};
exports.logout = logout;
exports.default = { signUp: exports.signUp, login: exports.login, logout: exports.logout };
