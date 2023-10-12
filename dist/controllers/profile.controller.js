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
exports.uploadAvatar = exports.updateProfile = exports.getProfile = void 0;
const profile_service_1 = require("../services/profile.service");
const user_repository_1 = require("../repositories/user.repository");
const HttpResponse_1 = __importDefault(require("../HttpResponse"));
const HttpException_1 = __importDefault(require("../HttpException"));
const profileService = new profile_service_1.ProfileService(new user_repository_1.UserReposotory());
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isSuccess, statusCode, message, data } = yield profileService.getProfile(+id);
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
exports.getProfile = getProfile;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedField = req.body;
        const { isSuccess, statusCode, message, data } = yield profileService.updateProfile(+id, updatedField);
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
exports.updateProfile = updateProfile;
const uploadAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        if (!file) {
            throw new HttpException_1.default(400, "file not found");
        }
        const { isSuccess, statusCode, message, data } = yield profileService.uploadAvatar(+id, file);
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
exports.uploadAvatar = uploadAvatar;
