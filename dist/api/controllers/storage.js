"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeObjectPinecone = exports.removeObject = exports.setObjectPinecone = exports.setObject = exports.getObject = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const aiMindURL = process.env.AI_MIND_URL;
const s3Client = new client_s3_1.S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESSABLE_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const BUCKET_NAME = '100xbrainly';
const checkObjectExistence = async (key) => {
    try {
        const checkCommand = new client_s3_1.HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        });
        await s3Client.send(checkCommand);
        return true;
    }
    catch (error) {
        if (error.name === "NotFound") {
            return false;
        }
        throw new Error(`Error checking object existence: ${error.message}`);
    }
};
const getObject = async (req, res) => {
    try {
        const key = req.query.key;
        if (await checkObjectExistence(key)) {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            });
            const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
            if (!url) {
                return res.status(400).json({ message: "Error in generating the signed URL for requested data" });
            }
            return res.status(200).json({ message: "Successfully generated the signed URL for requested data", url });
        }
        else {
            return res.status(404).json({ message: "Object does not exist in given location" });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in getting object : ${error.message}` });
    }
};
exports.getObject = getObject;
const ensureFolderExists = async (folderPath) => {
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    const createFolderCommand = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: normalizedPath,
    });
    try {
        await s3Client.send(createFolderCommand);
    }
    catch (error) {
        throw new Error(`Error creating folder: ${error.message}`);
    }
};
const setObject = async (req, res) => {
    try {
        const { userID, type, filename, contentType, fileObject } = req.body;
        const fullPath = `${userID}/${type}/${filename}`;
        const userFolder = `${userID}/`;
        const typeFolder = `${userID}/${type}/`;
        if (!await checkObjectExistence(userFolder)) {
            await ensureFolderExists(userFolder);
        }
        if (!await checkObjectExistence(typeFolder)) {
            await ensureFolderExists(typeFolder);
        }
        const createObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fullPath,
            ContentType: contentType
        });
        await s3Client.send(createObjectCommand);
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, createObjectCommand, { expiresIn: 3600 });
        if (!url) {
            return res.status(400).json({
                message: "Error generating signed URL for upload"
            });
        }
        return res.status(200).json({
            message: "AWS upload done, signed URL for file set successfully",
            url,
            fullPath
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error in setting object: ${error.message}`
        });
    }
};
exports.setObject = setObject;
const setObjectPinecone = async (req, res) => {
    try {
        const { file_url, type, key, userID } = req.body;
        const pineconeUpload = await fetch(`${aiMindURL}/aimind/storeDoc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                initial_query: {
                    "file_url": file_url,
                    "file_type": type
                },
                doc_info: {
                    "key": key,
                    "userID": userID,
                    "type": type
                }
            }),
        });
        if (!pineconeUpload) {
            res.status(400).json({ message: "Pinecone upload not successfully executed" });
        }
        const output = await pineconeUpload.json();
        return res.status(200).json({
            message: "Pinecone upload of document done",
            output
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error in setting object in pinecone: ${error.message}`
        });
    }
};
exports.setObjectPinecone = setObjectPinecone;
const removeObject = async (req, res) => {
    try {
        const key = req.query.key;
        if (await checkObjectExistence(key)) {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            });
            await s3Client.send(command);
            return res.status(200).json({ message: "Successfully deleted the requested data" });
        }
        else {
            return res.status(404).json({ message: "Object does not exist in given location" });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in deleting object : ${error.message}` });
    }
};
exports.removeObject = removeObject;
const removeObjectPinecone = async (req, res) => {
    try {
        const key = req.query.key;
        const pineconeDeletion = await fetch(`${aiMindURL}/aimind/deleteDoc`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "key": key,
            }),
        });
        if (!pineconeDeletion) {
            res.status(400).json({ message: "Pinecone upload not successfully executed" });
        }
        const output = await pineconeDeletion.json();
        return res.status(200).json({
            message: "Pinecone deletion of document done",
            output
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error in deleting object in pinecone: ${error.message}`
        });
    }
};
exports.removeObjectPinecone = removeObjectPinecone;
exports.default = { getObject: exports.getObject, setObject: exports.setObject, setObjectPinecone: exports.setObjectPinecone, removeObject: exports.removeObject, removeObjectPinecone: exports.removeObjectPinecone };
