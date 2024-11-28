"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const constants_1 = require("../../utils/constants");
const auth = (req, res, next) => {
    try {
        const requestAuthorization = req.cookies[`${constants_1.COOKIE_NAME}`];
        const decodedInfo = jsonwebtoken_1.default.verify(requestAuthorization, JWT_SECRET);
        if (!decodedInfo) {
            return res.status(401).json({ message: "Incorrect Authentication" });
        }
        else {
            res.locals.jwtData = decodedInfo.Id;
            return next();
        }
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
    }
};
exports.auth = auth;
exports.default = { auth: exports.auth };
