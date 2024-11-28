"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.TagModel = exports.LinkModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const User = new Schema({
    username: { type: String, unique: true },
    password: String
});
const Link = new Schema({
    hash: String,
    userID: { type: ObjectId, ref: 'User', required: true, unique: true }
});
const Tag = new Schema({
    title: { type: String, required: true, unique: true }
});
const contentTypes = ['image', 'video', 'text', 'audio'];
const Content = new Schema({
    link: String,
    type: { type: String, enum: contentTypes, required: true },
    title: String,
    description: { type: String, required: false },
    tags: [{ type: String, ref: 'Tag' }],
    userID: { type: ObjectId, ref: 'User', required: true }
});
const UserModel = mongoose_1.default.model('users', User);
exports.UserModel = UserModel;
const LinkModel = mongoose_1.default.model('links', Link);
exports.LinkModel = LinkModel;
const TagModel = mongoose_1.default.model('tags', Tag);
exports.TagModel = TagModel;
const ContentModel = mongoose_1.default.model('content', Content);
exports.ContentModel = ContentModel;
