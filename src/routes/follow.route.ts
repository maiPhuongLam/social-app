import express from "express";
import { validationResource } from "../middlewares/validation-resource";
import { auth } from "../middlewares/auth";
import { follow, unfollow } from "../controllers/follow.controller";
import { followSchema } from "../dtos/follow.dto";

const followRoute = express.Router();

followRoute.post(
  "/:followedId",
  auth,
  validationResource(followSchema),
  follow
);

followRoute.delete(
  "/:followedId",
  auth,
  validationResource(followSchema),
  unfollow
);

export default followRoute;
