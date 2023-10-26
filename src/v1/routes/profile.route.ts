import express, { Express } from "express";
import { validationResource } from "../middlewares/validation-resource";
import {
  getProfileSchema,
  updateProfileSchema,
  uploadAvatarSchema,
} from "../dtos/profile.dto";
import { auth } from "../middlewares/auth";
import profileController from "../controllers/profile.controller";

const profileRoute = express.Router();

profileRoute.get(
  "/:id",
  auth,
  validationResource(getProfileSchema),
  profileController.getProfile
);
profileRoute.put(
  "/:id",
  auth,
  validationResource(updateProfileSchema),
  profileController.updateProfile
);

profileRoute.put(
  "/:id/avatar",
  auth,
  validationResource(uploadAvatarSchema),
  profileController.uploadAvatar
);

class ProfileRoute {
  private app: Express = express();
}

export default profileRoute;
