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
exports.PostRepository = void 0;
const index_1 = require("../index");
class PostRepository {
    constructor() { }
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.post.findMany({
                where: {
                    published: true,
                },
            });
        });
    }
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.post.findUnique({ where: { id } });
        });
    }
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.post.create({
                data,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        });
    }
    updatePost(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.post.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { updatedAt: new Date(Date.now()) }),
            });
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.post.delete({ where: { id } });
        });
    }
}
exports.PostRepository = PostRepository;
