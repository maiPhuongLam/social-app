"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.checkOtpSchema = exports.sendOtpSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const custom_type_1 = require("../custom-type");
const loginSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(5, "Password to short"),
    }),
});
exports.loginSchema = loginSchema;
const registerSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(5, "Password to short"),
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        phone: (0, zod_1.string)({
            required_error: "Phone is required",
        }).regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
        dateOfBirth: (0, zod_1.string)({
            required_error: "DateOfBirth is required",
        }),
        gender: zod_1.z.nativeEnum(custom_type_1.Gender),
    }),
});
exports.registerSchema = registerSchema;
const sendOtpSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
    }),
});
exports.sendOtpSchema = sendOtpSchema;
const checkOtpSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        otp: (0, zod_1.number)({
            required_error: "Otp is required",
        }),
    }),
});
exports.checkOtpSchema = checkOtpSchema;
const resetPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }),
    }),
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "UserId is required",
        }),
    }),
});
exports.resetPasswordSchema = resetPasswordSchema;
