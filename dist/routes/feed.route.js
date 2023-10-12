"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feed_controller_1 = require("../controllers/feed.controller");
const auth_1 = require("../middlewares/auth");
const validation_resource_1 = require("../middlewares/validation-resource");
const post_dto_1 = require("../dtos/post.dto");
const feedRoute = express_1.default.Router();
feedRoute.post("/posts", auth_1.auth, (0, validation_resource_1.validationResource)(post_dto_1.createPostSchema), feed_controller_1.createPost);
feedRoute.put("/posts/:id", auth_1.auth, (0, validation_resource_1.validationResource)(post_dto_1.updatePostSchema), feed_controller_1.updatePost);
feedRoute.get("/posts/:id", (0, validation_resource_1.validationResource)(post_dto_1.getPostSchema), feed_controller_1.getPost);
feedRoute.delete("/posts/:id", (0, validation_resource_1.validationResource)(post_dto_1.getPostSchema), feed_controller_1.deletePost);
feedRoute.get("/posts", feed_controller_1.getListPosts);
exports.default = feedRoute;
