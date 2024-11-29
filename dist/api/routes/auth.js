"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../controllers/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const constants_1 = require("../../utils/constants");
const thridPartyRouter = (0, express_1.Router)();
thridPartyRouter.get('/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
thridPartyRouter.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            Id: user._id.toString()
        }, JWT_SECRET);
        const oldToken = req.signedCookies[`${constants_1.COOKIE_NAME}`];
        if (oldToken) {
            res.clearCookie(constants_1.COOKIE_NAME);
        }
        const expiresInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + expiresInMilliseconds);
        res.cookie(constants_1.COOKIE_NAME, token, {
            domain: "100x-brainly.vercel.app",
            expires,
            httpOnly: true,
            signed: true,
            secure: true
        });
        res.redirect('https://100x-brainly.vercel.app/home');
    }
    catch (error) {
        console.error('Google callback error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
thridPartyRouter.get('/github', passport_1.default.authenticate('github'));
thridPartyRouter.get('/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/' }), async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            Id: user._id.toString()
        }, JWT_SECRET);
        const oldToken = req.signedCookies[`${constants_1.COOKIE_NAME}`];
        if (oldToken) {
            res.clearCookie(constants_1.COOKIE_NAME);
        }
        const expiresInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + expiresInMilliseconds);
        res.cookie(constants_1.COOKIE_NAME, token, {
            domain: "100x-brainly.vercel.app",
            expires,
            httpOnly: true,
            signed: true,
            secure: true
        });
        res.redirect('https://100x-brainly.vercel.app/home');
    }
    catch (error) {
        console.error('Github callback error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
thridPartyRouter.get('/logout', user_1.logout);
exports.default = thridPartyRouter;
