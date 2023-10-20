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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const formate_data_1 = require("../utils/formate-data");
class FeedService {
    constructor(postRepository, likeRepository, commentRepository, sharedPostRepository, cacheService) {
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.sharedPostRepository = sharedPostRepository;
        this.cacheService = cacheService;
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield this.cacheService.getData(`posts:${id}`);
            if (cache.data) {
                console.log("Cache data success");
                return cache;
            }
            console.log("Miss cache");
            const post = yield this.postRepository.findPostById(id);
            if (!post) {
                return (0, formate_data_1.formateData)(false, 404, "Post not found", null);
            }
            yield this.cacheService.setData(`posts:${id}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 200, "Fetch post success", post);
        });
    }
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield this.cacheService.getData("posts");
            if (cache.data) {
                console.log("Cache data success");
                return cache;
            }
            const posts = yield this.postRepository.findPosts();
            if (!posts.length) {
                return (0, formate_data_1.formateData)(false, 404, "Posts not found", null);
            }
            yield this.cacheService.setData("posts", 3600, posts);
            return (0, formate_data_1.formateData)(true, 200, "Fetch post success", posts);
        });
    }
    createPost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.createPost(input);
            if (!post) {
                return (0, formate_data_1.formateData)(false, 400, "Create post fail", null);
            }
            const posts = yield this.postRepository.findPosts();
            yield this.cacheService.setData(`posts`, 3600, posts);
            return (0, formate_data_1.formateData)(true, 201, "Create post success", post);
        });
    }
    updatePost(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findPostById(id);
            if (!post) {
                return (0, formate_data_1.formateData)(false, 404, "Post not found", null);
            }
            const updatedPost = yield this.postRepository.updatePost(id, input);
            yield this.cacheService.setData(`posts:${id}`, 3600, updatedPost);
            const posts = yield this.postRepository.findPosts();
            yield this.cacheService.setData(`posts`, 3600, posts);
            return (0, formate_data_1.formateData)(true, 200, "Update post success", updatedPost);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findPostById(id);
            if (!post) {
                return (0, formate_data_1.formateData)(false, 404, "Post not found", null);
            }
            const data = yield this.postRepository.deletePost(id);
            yield this.cacheService.deleteData(`posts:${id}`);
            const posts = yield this.postRepository.findPosts();
            yield this.cacheService.setData(`posts`, 3600, posts);
            return (0, formate_data_1.formateData)(true, 200, "Delte post success", data);
        });
    }
    likePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.likeRepository.getLike(userId, postId);
            if (exist) {
                return (0, formate_data_1.formateData)(false, 403, "Action like is forbidden", null);
            }
            const like = yield this.likeRepository.createLike(userId, postId);
            const posts = yield this.postRepository.findPosts();
            const post = yield this.postRepository.findPostById(postId);
            yield this.cacheService.setData(`posts`, 3600, posts);
            yield this.cacheService.setData(`posts:${postId}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 201, "Like post success", like);
        });
    }
    dislikePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.likeRepository.getLike(userId, postId);
            if (!exist) {
                return (0, formate_data_1.formateData)(false, 403, "Action like is forbidden", null);
            }
            const like = yield this.likeRepository.deleteLike(userId, postId);
            const posts = yield this.postRepository.findPosts();
            const post = yield this.postRepository.findPostById(postId);
            yield this.cacheService.setData(`posts`, 3600, posts);
            yield this.cacheService.setData(`posts:${postId}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 201, "Dislike post success", like);
        });
    }
    commentPost(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.createComment(userId, postId, content);
            const posts = yield this.postRepository.findPosts();
            const post = yield this.postRepository.findPostById(postId);
            yield this.cacheService.setData(`posts`, 3600, posts);
            yield this.cacheService.setData(`posts:${postId}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 201, "Comment post success", comment);
        });
    }
    deleteCommentPost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.getComment(id);
            if (!comment) {
                return (0, formate_data_1.formateData)(false, 404, "Action like is forbidden", null);
            }
            console.log(comment.userId);
            console.log(userId);
            if (comment.userId !== userId) {
                return (0, formate_data_1.formateData)(false, 401, "Unauthorized", null);
            }
            const data = yield this.commentRepository.deleteComment(id);
            const posts = yield this.postRepository.findPosts();
            const post = yield this.postRepository.findPostById(id);
            yield this.cacheService.setData(`posts`, 3600, posts);
            yield this.cacheService.setData(`posts:${id}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 201, "Delete post success", data);
        });
    }
    sharedPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.sharedPostRepository.getSharedPost(userId, postId);
            if (exist) {
                return (0, formate_data_1.formateData)(false, 403, "Action like is forbidden", null);
            }
            const sharedPost = yield this.sharedPostRepository.createSharedPost(userId, postId);
            if (!sharedPost) {
                return (0, formate_data_1.formateData)(false, 400, "Share post fail", null);
            }
            // const newPost = await this.postRepository.createPost({
            //   title: sharedPost?.post.title,
            //   authorId: sharedPost?.post.authorId,
            //   content: sharedPost.post.content,
            //   published: true
            // })
            const posts = yield this.postRepository.findPosts();
            const post = yield this.postRepository.findPostById(postId);
            yield this.cacheService.setData(`posts`, 3600, posts);
            yield this.cacheService.setData(`posts:${postId}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 201, "Shared post success", sharedPost);
        });
    }
    unSharePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.sharedPostRepository.getSharedPost(userId, postId);
            if (!exist) {
                return (0, formate_data_1.formateData)(false, 403, "Post not exist", null);
            }
            const data = yield this.sharedPostRepository.deleteSharedPost(userId, postId);
            const posts = yield this.postRepository.findPosts();
            const post = yield this.postRepository.findPostById(postId);
            yield this.cacheService.setData(`posts`, 3600, posts);
            yield this.cacheService.setData(`posts:${postId}`, 3600, post);
            return (0, formate_data_1.formateData)(true, 201, "Unshared post success", data);
        });
    }
}
exports.FeedService = FeedService;
