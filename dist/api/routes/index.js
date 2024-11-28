"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const content_1 = __importDefault(require("./content"));
const share_1 = __importDefault(require("./share"));
const auth_1 = __importDefault(require("./auth"));
const appRouter = (0, express_1.Router)();
appRouter.get('/', (req, res) => {
    res.status(200).send("Hello from 100xBrainly Backend!");
});
appRouter.use('/user', user_1.default);
appRouter.use('/content', content_1.default);
appRouter.use('/share', share_1.default);
appRouter.use('/auth', auth_1.default);
exports.default = appRouter;
