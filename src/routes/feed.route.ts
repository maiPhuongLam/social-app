import express from "express";
import {
  createPost,
  deletePost,
  getListPosts,
  getPost,
  updatePost,
} from "../controllers/feed.controller";
import { FeedService } from "../services/feed.service";
import { PostRepository } from "../repositories/post.repository";
import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import {
  createPostSchema,
  getPostSchema,
  updatePostSchema,
} from "../dtos/post.dto";

const feedRoute = express.Router();

feedRoute.post(
  "/posts",
  auth,
  validationResource(createPostSchema),
  createPost
);
feedRoute.put(
  "/posts/:id",
  auth,
  validationResource(updatePostSchema),
  updatePost
);
feedRoute.get("/posts/:id", validationResource(getPostSchema), getPost);
feedRoute.delete("/posts/:id", validationResource(getPostSchema), deletePost);
feedRoute.get("/posts", getListPosts);

export default feedRoute;
