"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.editContent = exports.viewContent = exports.addContent = exports.getAllTags = void 0;
const model_1 = require("../db/model");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllTags = async (req, res) => {
    try {
        const response = await model_1.TagModel.find();
        if (!response) {
            return res.status(404).json({ message: "Error in fetching the tags" });
        }
        return res.status(200).json({ message: `All tags fetched`, response });
    }
    catch (error) {
        res.status(500).json({ message: `Error in fetching tags ${error.message}` });
    }
};
exports.getAllTags = getAllTags;
const addContent = async (req, res) => {
    try {
        const requestBody = req.body;
        if (requestBody) {
            const title = requestBody.title;
            const description = requestBody.description;
            const link = requestBody.link;
            const type = requestBody.type;
            const tags = requestBody.tags;
            const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
            tags.map(async (tag) => {
                const response = await model_1.TagModel.findOne({
                    title: tag.value
                });
                if (!response) {
                    await model_1.TagModel.create({
                        title: tag.value
                    });
                }
            });
            let tagsArray = [];
            await Promise.all(tags.map(async (tag) => {
                tagsArray.push(tag.value);
            }));
            await model_1.ContentModel.create({
                title: title,
                description: description ? description : null,
                link: link,
                type: type,
                tags: tagsArray,
                userID: userID
            });
            return res.status(201).json({ message: "New content added." });
        }
        else {
            res.status(400).json({ message: "Content details missing" });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in adding new content ${error.message}` });
    }
};
exports.addContent = addContent;
const viewContent = async (req, res) => {
    try {
        const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
        const response = await model_1.ContentModel.find({
            userID: userID
        });
        if (!response) {
            return res.status(404).json({ message: "Error in fetching the content" });
        }
        return res.status(200).json({ message: `All content for the user ${userID}`, response });
    }
    catch (error) {
        res.status(500).json({ message: `Error in adding new content ${error.message}` });
    }
};
exports.viewContent = viewContent;
const editContent = async (req, res) => {
    try {
        const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
        const requestBody = req.body;
        const title = requestBody.title;
        const description = requestBody.description;
        const link = requestBody.link;
        const type = requestBody.type;
        const tags = requestBody.tags;
        console.log(requestBody.contentID);
        tags.map(async (tag) => {
            const response = await model_1.TagModel.findOne({
                title: tag.value
            });
            if (!response) {
                await model_1.TagModel.create({
                    title: tag.value
                });
            }
        });
        let tagsArray = [];
        await Promise.all(tags.map(async (tag) => {
            tagsArray.push(tag.value);
        }));
        if (requestBody) {
            const response = await model_1.ContentModel.findOneAndUpdate({
                _id: new mongoose_1.default.Types.ObjectId(`${requestBody.contentID}`),
                userID: userID
            }, {
                title: title,
                description: description ? description : null,
                link: link,
                type: type,
                tags: tagsArray,
                userID: userID
            });
            if (!response) {
                res.status(403).json({ message: "You are trying to update content which is not yours." });
            }
            return res.status(200).json({ message: "Content updated successfully" });
        }
        else {
            res.status(400).json({ message: "Content could not be updated." });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in adding new content ${error.message}` });
    }
};
exports.editContent = editContent;
const deleteContent = async (req, res) => {
    try {
        const userID = new mongoose_1.default.Types.ObjectId(`${res.locals.jwtData}`);
        const requestBody = req.body;
        if (requestBody) {
            const contentID = new mongoose_1.default.Types.ObjectId(`${requestBody.contentID}`);
            const response = await model_1.ContentModel.deleteOne({
                _id: contentID,
                userID: userID
            });
            if (!response) {
                res.status(403).json({ message: "You are trying to delete content which is not yours." });
            }
            return res.status(200).json({ message: "Content deleted successfully" });
        }
        else {
            res.status(400).json({ message: "Content details missing" });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Error in adding new content ${error.message}` });
    }
};
exports.deleteContent = deleteContent;
exports.default = { getAllTags: exports.getAllTags, addContent: exports.addContent, viewContent: exports.viewContent, editContent: exports.editContent, deleteContent: exports.deleteContent };
