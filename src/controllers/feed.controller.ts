import { NextFunction, Response, Request } from "express";
import { FeedService } from "../services/feed.service";
import { PostRepository } from "../repositories/post.repository";
import HttpResponse from "../HttpResponse";
import HttpException from "../HttpException";
import { CreatPostDto, UpdatePostDto } from "../dtos/post.dto";
import { CacheService } from "../services/cache.service";
import Redis from "ioredis";
const feedService = new FeedService(
  new PostRepository(),
  new CacheService(new Redis())
);
const cacheService = new CacheService(new Redis());

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = <CreatPostDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } =
      await feedService.createPost(body);

    if (!isSuccess) {
      return new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { isSuccess, statusCode, message, data } = await feedService.getPost(
      +id
    );

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const getListPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isSuccess, statusCode, message, data } =
      await feedService.getPosts();

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = <UpdatePostDto["params"]>req.params;
    const body = <UpdatePostDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } =
      await feedService.updatePost(+id, body);

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { isSuccess, statusCode, message, data } =
      await feedService.deletePost(+id);

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const dislikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const sharePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const commentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteCommentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
