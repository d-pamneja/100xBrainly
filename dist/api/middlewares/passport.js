"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const model_1 = require("../../db/model");
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const username = profile.displayName;
        let user = await model_1.UserModel.findOne({ username: username });
        if (!user) {
            const hashedPassword = await bcrypt_1.default.hash('GOOGLE_PASSWORD', 5);
            user = new model_1.UserModel({
                username: username,
                password: hashedPassword
            });
            await user.save();
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, null);
    }
})),
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: process.env.GITHUB_CALLBACK_URL || ''
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const username = profile.username;
            let user = await model_1.UserModel.findOne({ username: username });
            if (!user) {
                const hashedPassword = await bcrypt_1.default.hash('GITHUB_PASSWORD', 5);
                user = new model_1.UserModel({
                    username: username,
                    password: hashedPassword
                });
                await user.save();
            }
            return done(null, user);
        }
        catch (error) {
            return done(error, null);
        }
    }));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await model_1.UserModel.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
