"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validation_resource_1 = require("../middlewares/validation-resource");
const auth_dto_1 = require("../dtos/auth.dto");
const authRouter = express_1.default.Router();
authRouter.post("/register", (0, validation_resource_1.validationResource)(auth_dto_1.registerSchema), auth_controller_1.register);
authRouter.post("/login", (0, validation_resource_1.validationResource)(auth_dto_1.loginSchema), auth_controller_1.login);
authRouter.put("/refresh-token", auth_controller_1.refreshToken);
authRouter.put("/otp/send", (0, validation_resource_1.validationResource)(auth_dto_1.sendOtpSchema), auth_controller_1.sendOtp);
authRouter.post("/otp/check", (0, validation_resource_1.validationResource)(auth_dto_1.checkOtpSchema), auth_controller_1.checkOtp);
authRouter.put("/forgot-password/:id", (0, validation_resource_1.validationResource)(auth_dto_1.resetPasswordSchema), auth_controller_1.forgotPassword);
exports.default = authRouter;
