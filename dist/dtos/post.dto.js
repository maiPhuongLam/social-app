"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
const params = (0, zod_1.object)({
    id: (0, zod_1.string)({
        required_error: "Id is required",
    }),
});
const createPostSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        }),
        content: (0, zod_1.string)({
            required_error: "Content is required",
        }),
        published: (0, zod_1.boolean)({
            required_error: "Published is required",
        }),
        authorId: (0, zod_1.number)({
            required_error: "AuthorId is required",
        }),
    }),
});
exports.createPostSchema = createPostSchema;
const updatePostSchema = (0, zod_1.object)({
    params,
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        }).optional(),
        content: (0, zod_1.string)({
            required_error: "Content is required",
        }).optional(),
        published: (0, zod_1.boolean)({
            required_error: "Published is required",
        }).optional(),
    }),
});
exports.updatePostSchema = updatePostSchema;
const getPostSchema = (0, zod_1.object)({ params });
exports.getPostSchema = getPostSchema;
