"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_resource_1 = require("../middlewares/validation-resource");
const profile_dto_1 = require("../dtos/profile.dto");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_1 = require("../middlewares/auth");
const profileRoute = express_1.default.Router();
profileRoute.get("/:id", auth_1.auth, (0, validation_resource_1.validationResource)(profile_dto_1.getProfileSchema), profile_controller_1.getProfile);
profileRoute.put("/:id", auth_1.auth, (0, validation_resource_1.validationResource)(profile_dto_1.updateProfileSchema), profile_controller_1.updateProfile);
profileRoute.put("/:id/avatar", auth_1.auth, (0, validation_resource_1.validationResource)(profile_dto_1.uploadAvatarSchema), profile_controller_1.uploadAvatar);
exports.default = profileRoute;
