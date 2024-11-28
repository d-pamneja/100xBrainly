"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewLink = exports.shareLink = exports.linkStatus = void 0;
const model_1 = require("../db/model");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const linkStatus = async (req, res) => {
    try {
        const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
        const linkCheck = await model_1.LinkModel.find({
            userID: userID
        });
        return res.status(200).json({ message: `Sharing link status for ${userID} fetched `, linkStatus: linkCheck[0] ? true : false, linkCheck });
    }
    catch (error) {
        res.status(500).json({ message: `Error in sharing dashboard ${error.message}` });
    }
};
exports.linkStatus = linkStatus;
const shareLink = async (req, res) => {
    var _a, _b;
    try {
        const requestBody = req.body;
        if (requestBody) {
            const setting = requestBody.share;
            if (setting === true) {
                const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
                const user = await model_1.UserModel.findById(userID);
                if (!user) {
                    res.status(404).json({ message: "User not found." });
                }
                const username = ((_a = user === null || user === void 0 ? void 0 : user.username) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, '')) || '';
                const shareToken = jsonwebtoken_1.default.sign({
                    userID: userID,
                    share: setting
                }, JWT_SECRET);
                const encodedToken = Buffer.from(shareToken).toString('base64url');
                const link = `http://localhost:5173/share/viewBrain/${username}/${encodedToken}`;
                await model_1.LinkModel.create({
                    hash: link,
                    userID: userID
                });
                return res.status(201).json({ message: `Sharable link activated for the brain of user ${username}`, link });
            }
            else {
                const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
                const user = await model_1.UserModel.findById(userID);
                if (!user) {
                    res.status(404).json({ message: "User not found." });
                }
                const username = ((_b = user === null || user === void 0 ? void 0 : user.username) === null || _b === void 0 ? void 0 : _b.replace(/\s+/g, '')) || '';
                await model_1.LinkModel.deleteOne({
                    userID: userID
                });
                res.status(200).json({ message: `Sharable link de-activated for the brain of user ${username}` });
            }
        }
        else {
            return res.status(404).json({ message: "Details to share not found." });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in sharing dashboard ${error.message}` });
    }
};
exports.shareLink = shareLink;
const viewLink = async (req, res) => {
    try {
        const shareToken = Buffer.from(req.params.uid, 'base64url').toString('utf-8');
        const decodedLink = jsonwebtoken_1.default.verify(shareToken, JWT_SECRET);
        if (decodedLink) {
            const ID = decodedLink.userID;
            const requestUserID = new mongoose_1.default.Types.ObjectId(`${ID}`);
            const linkAccess = decodedLink.share;
            const LinkResponse = await model_1.LinkModel.findOne({
                userID: requestUserID
            });
            if (LinkResponse) {
                const contentResponse = await model_1.ContentModel.find({
                    userID: requestUserID
                });
                if (contentResponse) {
                    res.status(200).json({ message: "Access to this brain has been granted.", contentResponse, LinkResponse });
                }
            }
            else {
                res.status(403).json({ message: "Access to this brain has been denied." });
            }
        }
        else {
            return res.status(404).json({ message: "Invalid share link." });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in adding new content ${error.message}` });
    }
};
exports.viewLink = viewLink;
exports.default = { shareLink: exports.shareLink, viewLink: exports.viewLink };
