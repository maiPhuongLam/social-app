import express from "express";
import {
  commentPost,
  createPost,
  deleteCommentPost,
  deletePost,
  dislikePost,
  getListPosts,
  getPost,
  likePost,
  sharePost,
  unSharePost,
  updatePost,
} from "../controllers/feed.controller";

import { auth } from "../middlewares/auth";
import { validationResource } from "../middlewares/validation-resource";
import {
  createPostSchema,
  getPostSchema,
  updatePostSchema,
} from "../dtos/post.dto";
import { likeSchema } from "../dtos/like.dto";
import { createCommentSchema, deleteCommentSchema } from "../dtos/comment.dto";
import { shareSchema } from "../dtos/share.dto";

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
feedRoute.delete(
  "/posts/:id",
  auth,
  validationResource(getPostSchema),
  deletePost
);
feedRoute.get("/posts", getListPosts);
feedRoute.post(
  "/posts/:postId/like",
  auth,
  validationResource(likeSchema),
  likePost
);
feedRoute.delete(
  "/posts/:postId/dislike",
  auth,
  validationResource(likeSchema),
  dislikePost
);
feedRoute.post(
  "/posts/:postId/comment",
  auth,
  validationResource(createCommentSchema),
  commentPost
);
feedRoute.delete(
  "/posts/delete-comment/:commentId",
  auth,
  validationResource(deleteCommentSchema),
  deleteCommentPost
);
feedRoute.post(
  "/posts/:postId/share",
  auth,
  validationResource(shareSchema),
  sharePost
);
feedRoute.delete(
  "/posts/:postId/share",
  auth,
  validationResource(shareSchema),
  unSharePost
);

export default feedRoute;
