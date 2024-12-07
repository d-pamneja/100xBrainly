"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDocQuery = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const aiMindURL = process.env.AI_MIND_URL;
const sendDocQuery = async (req, res) => {
    try {
        const requestBody = req.body;
        if (requestBody) {
            const user_query = requestBody.user_query;
            const userID = requestBody.userID;
            const key = requestBody.key;
            const response = await fetch(`${aiMindURL}/aimind/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_query: user_query,
                    userID: userID,
                    key: key,
                }),
            });
            if (response) {
                const output = await response.json();
                return res.status(200).json({ message: "Output from AI Mind fetched successfully", output });
            }
            else {
                return res.status(400).json({ message: "Could not generate output from AI Mind" });
            }
        }
        else {
            res.status(400).json({ message: "Document details missing" });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in fetching answer from AI Mind ${error.message}` });
    }
};
exports.sendDocQuery = sendDocQuery;
exports.default = { sendDocQuery: exports.sendDocQuery };
