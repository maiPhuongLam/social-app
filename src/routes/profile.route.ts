import express from "express";
import { validationResource } from "../middlewares/validation-resource";
import {
  getUserSchema,
  updateUserSchema,
  uploadAvatarSchema,
} from "../dtos/user.dto";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/profile.controller";
import { auth } from "../middlewares/auth";

const profileRoute = express.Router();

profileRoute.get("/:id", auth, validationResource(getUserSchema), getProfile);
profileRoute.put(
  "/:id",
  auth,
  validationResource(updateUserSchema),
  updateProfile
);

validationResource(updateUserSchema),
  profileRoute.put(
    "/:id/avatar",
    auth,
    validationResource(uploadAvatarSchema),
    uploadAvatar
  );

export default profileRoute;
