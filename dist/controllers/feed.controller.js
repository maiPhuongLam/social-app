"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentPost = exports.commentPost = exports.unSharePost = exports.sharePost = exports.dislikePost = exports.likePost = exports.deletePost = exports.updatePost = exports.getListPosts = exports.getPost = exports.createPost = void 0;
const feed_service_1 = require("../services/feed.service");
const post_repository_1 = require("../repositories/post.repository");
const HttpResponse_1 = __importDefault(require("../HttpResponse"));
const HttpException_1 = __importDefault(require("../HttpException"));
const cache_service_1 = require("../services/cache.service");
const ioredis_1 = __importDefault(require("ioredis"));
const like_repository_1 = require("../repositories/like.repository");
const comment_repository_1 = require("../repositories/comment.repository");
const sharedPost_repository_1 = require("../repositories/sharedPost.repository");
const feedService = new feed_service_1.FeedService(new post_repository_1.PostRepository(), new like_repository_1.LikeRepository(), new comment_repository_1.CommentRepository(), new sharedPost_repository_1.SharedPostRepository(), new cache_service_1.CacheService(new ioredis_1.default()));
const cacheService = new cache_service_1.CacheService(new ioredis_1.default());
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { isSuccess, statusCode, message, data } = yield feedService.createPost(body);
        if (!isSuccess) {
            return new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isSuccess, statusCode, message, data } = yield feedService.getPost(parseInt(id));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.getPost = getPost;
const getListPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isSuccess, statusCode, message, data } = yield feedService.getPosts();
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.getListPosts = getListPosts;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const body = req.body;
        const { isSuccess, statusCode, message, data } = yield feedService.updatePost(parseInt(id), body);
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isSuccess, statusCode, message, data } = yield feedService.deletePost(parseInt(id));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.deletePost = deletePost;
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        const { isSuccess, statusCode, message, data } = yield feedService.likePost(userId, parseInt(postId));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.likePost = likePost;
const dislikePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        const { isSuccess, statusCode, message, data } = yield feedService.dislikePost(userId, parseInt(postId));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.dislikePost = dislikePost;
const sharePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        const { isSuccess, statusCode, message, data } = yield feedService.sharedPost(userId, +parseInt(postId));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.sharePost = sharePost;
const unSharePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const userId = req.userId;
        const { isSuccess, statusCode, message, data } = yield feedService.unSharePost(userId, +parseInt(postId));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.unSharePost = unSharePost;
const commentPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.userId;
        const { isSuccess, statusCode, message, data } = yield feedService.commentPost(userId, parseInt(postId), content);
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next(error);
    }
});
exports.commentPost = commentPost;
const deleteCommentPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const userId = req.userId;
        const { isSuccess, statusCode, message, data } = yield feedService.deleteCommentPost(parseInt(commentId), userId);
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(statusCode)
            .json(new HttpResponse_1.default(statusCode, message, data));
    }
    catch (error) {
        next();
    }
});
exports.deleteCommentPost = deleteCommentPost;
