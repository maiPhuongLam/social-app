"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatarSchema = exports.updateProfileSchema = exports.getProfileSchema = void 0;
const zod_1 = require("zod");
const custom_type_1 = require("../custom-type");
const getProfileSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Id is required",
        }),
    }),
});
exports.getProfileSchema = getProfileSchema;
const updateProfileSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Id is required",
        }),
    }),
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).optional(),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        })
            .min(5, "Password to short")
            .optional(),
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }).optional(),
        phone: (0, zod_1.string)({
            required_error: "Phone is required",
        }).optional(),
        dateOfBirth: (0, zod_1.date)({
            required_error: "DateOfBirth is required",
        }).optional(),
        gender: zod_1.z.nativeEnum(custom_type_1.Gender).optional(),
    }),
});
exports.updateProfileSchema = updateProfileSchema;
const uploadAvatarSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Id is required",
        }),
    }),
});
exports.uploadAvatarSchema = uploadAvatarSchema;
