import express from "express";
import feedController from "../controllers/feed.controller";
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
  "/",
  auth,
  validationResource(createPostSchema),
  feedController.createPost
);
feedRoute.put(
  "/:id",
  auth,
  validationResource(updatePostSchema),
  feedController.updatePost
);
feedRoute.get(
  "/:id",
  validationResource(getPostSchema),
  feedController.getPost
);
feedRoute.delete(
  "/:id",
  auth,
  validationResource(getPostSchema),
  feedController.deletePost
);
feedRoute.get("/", feedController.getListPosts);
feedRoute.post(
  "/:postId/like",
  auth,
  validationResource(likeSchema),
  feedController.likePost
);
feedRoute.delete(
  "/:postId/dislike",
  auth,
  validationResource(likeSchema),
  feedController.dislikePost
);
feedRoute.post(
  "/:postId/comment",
  auth,
  validationResource(createCommentSchema),
  feedController.commentPost
);
feedRoute.delete(
  "/:postId/delete-comment/:commentId",
  auth,
  validationResource(deleteCommentSchema),
  // (req, res) => {
  //   res.send("test");
  // }
  feedController.deleteCommentPost
);
feedRoute.post(
  "/:postId/share",
  auth,
  validationResource(shareSchema),
  feedController.sharePost
);
feedRoute.delete(
  "/:postId/share",
  auth,
  validationResource(shareSchema),
  feedController.unSharePost
);

export default feedRoute;
