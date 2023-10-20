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

feedRoute.post("/", auth, validationResource(createPostSchema), createPost);
feedRoute.put("/:id", auth, validationResource(updatePostSchema), updatePost);
feedRoute.get("/:id", validationResource(getPostSchema), getPost);
feedRoute.delete("/:id", auth, validationResource(getPostSchema), deletePost);
feedRoute.get("/", getListPosts);
feedRoute.post("/:postId/like", auth, validationResource(likeSchema), likePost);
feedRoute.delete(
  "/:postId/dislike",
  auth,
  validationResource(likeSchema),
  dislikePost
);
feedRoute.post(
  "/:postId/comment",
  auth,
  validationResource(createCommentSchema),
  commentPost
);
feedRoute.delete(
  "/delete-comment/:commentId",
  auth,
  validationResource(deleteCommentSchema),
  deleteCommentPost
);
feedRoute.post(
  "/:postId/share",
  auth,
  validationResource(shareSchema),
  sharePost
);
feedRoute.delete(
  "/:postId/share",
  auth,
  validationResource(shareSchema),
  unSharePost
);

export default feedRoute;
