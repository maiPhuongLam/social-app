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
exports.forgotPassword = exports.checkOtp = exports.sendOtp = exports.refreshToken = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const custom_type_1 = require("../custom-type");
const HttpResponse_1 = __importDefault(require("../HttpResponse"));
const HttpException_1 = __importDefault(require("../HttpException"));
const user_repository_1 = require("../repositories/user.repository");
const authService = new auth_service_1.AuthService(new user_repository_1.UserReposotory());
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { data, message, statusCode, isSuccess } = yield authService.register(Object.assign(Object.assign({}, body), { dateOfBirth: new Date(body.dateOfBirth), type: custom_type_1.UserTypes.USER }));
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        res.cookie("_auth_token_", data.refresh_token, {
            httpOnly: true,
        });
        return res
            .status(201)
            .json(new HttpResponse_1.default(statusCode, message, data.access_token));
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { isSuccess, statusCode, message, data } = yield authService.login({
            email,
            password,
        });
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        res.cookie("_auth_token_", data.refresh_token, {
            httpOnly: true,
        });
        return res
            .status(201)
            .json(new HttpResponse_1.default(statusCode, message, data.access_token));
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies._auth_token_;
        if (!token) {
            throw new HttpException_1.default(401, "Unauthorized");
        }
        const { isSuccess, statusCode, message, data } = yield authService.getNewToken(token);
        if (!isSuccess) {
            throw new HttpException_1.default(statusCode, message);
        }
        return res
            .status(201)
            .json(new HttpResponse_1.default(statusCode, message, data.access_token));
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const { isSuccess, statusCode, message, data } = yield authService.sendOtp(email);
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
exports.sendOtp = sendOtp;
const checkOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const { isSuccess, statusCode, message, data } = yield authService.checkOtp(+otp);
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
exports.checkOtp = checkOtp;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const { isSuccess, statusCode, message, data } = yield authService.resetPassword(+id, password);
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
exports.forgotPassword = forgotPassword;
