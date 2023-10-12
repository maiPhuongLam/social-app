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
const post_repository_1 = require("../repositories/post.repository");
const formate_data_1 = require("../utils/formate-data");
class FeedService {
    constructor(postRepository) {
        this.postRepository = postRepository;
        this.postRepository = new post_repository_1.PostRepository();
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findPostById(id);
            if (!post) {
                return (0, formate_data_1.formateData)(false, 404, "Post not found", null);
            }
            return (0, formate_data_1.formateData)(true, 200, "Fetch post success", post);
        });
    }
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postRepository.findPosts();
            if (!posts.length) {
                return (0, formate_data_1.formateData)(false, 404, "Posts not found", null);
            }
            return (0, formate_data_1.formateData)(true, 200, "Fetch post success", posts);
        });
    }
    createPost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.createPost(input);
            if (!post) {
                return (0, formate_data_1.formateData)(false, 400, "Create post fail", null);
            }
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
            return (0, formate_data_1.formateData)(true, 200, "Delte post success", data);
        });
    }
}
exports.FeedService = FeedService;
