"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = void 0;
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const userSchema = zod_1.default.object({
    username: zod_1.default.string()
        .min(3, "The username should be a minimum of three characters")
        .max(10, "The username should be a maximum of 10 characters"),
    password: zod_1.default.string()
        .min(8, "The password has to be a minimum of 8 characters")
        .max(20, "The password has to be a maximum of 20 characters")
        .refine((password) => /[A-Z]/.test(password), { message: "Required atleast one uppercase character" })
        .refine((password) => /[a-z]/.test(password), { message: "Required atleast one lowercase character" })
        .refine((password) => /[0-9]/.test(password), { message: "Required atleast one number" })
        .refine((password) => /[!@#$%^&*]/.test(password), { message: "Required atleast one special character" })
});
const checkCredentials = (req, res, next) => {
    try {
        const requestBody = req.body;
        if (requestBody && requestBody.username && requestBody.password) {
            const validationResult = userSchema.safeParse(requestBody);
            if (!validationResult.success) {
                const errors = validationResult.error.issues;
                let errorsArray = errors.map(error => {
                    return error.message;
                });
                return res.status(400).json({ message: "Validation error(s)", details: errorsArray });
            }
            else {
                next();
            }
        }
        else {
            if (!requestBody) {
                res.status(400).json({ message: "Invalid request body" });
            }
            else if (!requestBody.username) {
                res.status(411).json({ message: "User name not found." });
            }
            else if (!requestBody.password) {
                res.status(411).json({ message: "Password not found." });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ message: `Error at backend with error : ${error.message}` });
    }
};
exports.checkCredentials = checkCredentials;
exports.default = { checkCredentials: exports.checkCredentials };
