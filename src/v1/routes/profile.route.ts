import express from "express";
import { validationResource } from "../middlewares/validation-resource";
import {
  getProfileSchema,
  updateProfileSchema,
  uploadAvatarSchema,
} from "../dtos/profile.dto";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/profile.controller";
import { auth } from "../middlewares/auth";

const profileRoute = express.Router();

profileRoute.get(
  "/:id",
  auth,
  validationResource(getProfileSchema),
  getProfile
);
profileRoute.put(
  "/:id",
  auth,
  validationResource(updateProfileSchema),
  updateProfile
);

profileRoute.put(
  "/:id/avatar",
  auth,
  validationResource(uploadAvatarSchema),
  uploadAvatar
);

export default profileRoute;
