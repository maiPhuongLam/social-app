import express from "express";
import { validationResource } from "../middlewares/validation-resource";
import { auth } from "../middlewares/auth";
import followController from "../controllers/follow.controller";
import { followSchema } from "../dtos/follow.dto";

const followRoute = express.Router();

followRoute.post(
  "/:followedId",
  auth,
  validationResource(followSchema),
  followController.follow
);

followRoute.delete(
  "/:followedId",
  auth,
  validationResource(followSchema),
  followController.unfollow
);

export default followRoute;
