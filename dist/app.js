"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const routes_1 = __importDefault(require("./api/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./api/middlewares/passport");
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const mongoose_1 = require("mongoose");
const dotenv_2 = __importDefault(require("dotenv"));
dotenv_2.default.config();
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)({ origin: "https://100x-brainly.vercel.app", credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use('/', routes_1.default);
(0, mongoose_1.connect)(process.env.MONGODB_URI)
    .then(() => {
    console.log("Server set and connected to MongoDB.");
})
    .catch((err) => console.log("MongoDB connection error: ", err));
module.exports.handler = (0, serverless_http_1.default)(app);
exports.default = app;
