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
exports.ProfileService = void 0;
const formate_data_1 = require("../utils/formate-data");
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = require("fs");
const config_1 = __importDefault(require("../config"));
class ProfileService {
    constructor(userRepository, cacheService) {
        this.userRepository = userRepository;
        this.cacheService = cacheService;
        cloudinary_1.default.v2.config({
            cloud_name: config_1.default.cloudinary.cloud_name,
            api_key: config_1.default.cloudinary.api_key,
            api_secret: config_1.default.cloudinary.api_secret,
            secure: true,
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield this.cacheService.getData(`profiles:${id}`);
            if (cache.data) {
                console.log("Cache data success");
                return cache;
            }
            const userProfile = yield this.userRepository.findUserById(id);
            if (!userProfile) {
                return (0, formate_data_1.formateData)(false, 404, "User not found", null);
            }
            yield this.cacheService.setData(`profiles:${id}`, 3600, userProfile);
            return (0, formate_data_1.formateData)(true, 200, "Get Profile success", Object.assign(Object.assign({}, userProfile), { dateOfBirth: userProfile.dateOfBirth.toLocaleDateString() }));
        });
    }
    updateProfile(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield this.userRepository.findUserById(id);
            if (!userProfile) {
                return (0, formate_data_1.formateData)(false, 404, "User not found", null);
            }
            const updatedUser = yield this.userRepository.updateUser(id, input);
            yield this.cacheService.setData(`profiles:${id}`, 3600, updatedUser);
            return (0, formate_data_1.formateData)(true, 200, "Get Profile success", updatedUser);
        });
    }
    uploadAvatar(id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield this.userRepository.findUserById(id);
            if (!userProfile) {
                return (0, formate_data_1.formateData)(false, 404, "User not found", null);
            }
            if (userProfile.avatar && userProfile.avatarPublicId) {
                yield cloudinary_1.default.v2.uploader.destroy(userProfile.avatarPublicId, {
                    invalidate: true,
                });
            }
            const resCloudinary = yield cloudinary_1.default.v2.uploader.upload(file.path, {
                folder: config_1.default.cloudinary.folderPath,
                public_id: `${config_1.default.cloudinary.publicId_prefix}${Date.now()}`,
                transformation: [
                    {
                        width: "400x400".toString().split("x")[0],
                        height: "400x400".toString().split("x")[1],
                        crop: "fill",
                    },
                    {
                        quality: "auto",
                    },
                ],
            });
            (0, fs_1.unlinkSync)(file.path);
            const data = yield this.userRepository.updateUser(id, {
                avatar: resCloudinary.secure_url,
                avatarPublicId: resCloudinary.public_id,
            });
            yield this.cacheService.setData(`profiles:${id}`, 3600, data);
            return (0, formate_data_1.formateData)(true, 200, "Upload avatar success", data);
        });
    }
}
exports.ProfileService = ProfileService;
