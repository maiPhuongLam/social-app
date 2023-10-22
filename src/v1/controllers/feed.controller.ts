import { NextFunction, Response, Request } from "express";
import { FeedService } from "../services/feed.service";
import { PostRepository } from "../repositories/post.repository";
import HttpResponse from "../../HttpResponse";
import HttpException from "../../HttpException";
import { CreatPostDto, UpdatePostDto } from "../dtos/post.dto";
import { CacheService } from "../services/cache.service";
import Redis from "ioredis";
import { LikeRepository } from "../repositories/like.repository";
import { CommentRepository } from "../repositories/comment.repository";
import { SharedPostRepository } from "../repositories/sharedPost.repository";
const feedService = new FeedService(
  new PostRepository(),
  new LikeRepository(),
  new CommentRepository(),
  new SharedPostRepository(),
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
    const { authorId, published } = body;
    const image = req.file as Express.Multer.File;
    const { isSuccess, statusCode, message, data } =
      await feedService.createPost(
        {
          ...body,
          authorId: Number(authorId),
          published: JSON.parse(published),
        },
        image
      );

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
      parseInt(id)
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
    console.log(0);
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
    const { id } = req.params;
    const body = <UpdatePostDto["body"]>req.body;
    const { published } = body;
    const image = req.file as Express.Multer.File;
    const { isSuccess, statusCode, message, data } =
      await feedService.updatePost(
        parseInt(id),
        {
          ...body,
          published: published ? JSON.parse(published) : undefined,
        },
        image
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

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { isSuccess, statusCode, message, data } =
      await feedService.deletePost(parseInt(id));

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
) => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } = await feedService.likePost(
      userId,
      parseInt(postId)
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

export const dislikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await feedService.dislikePost(userId, parseInt(postId));

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

export const sharePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await feedService.sharedPost(userId, +parseInt(postId));

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

export const unSharePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await feedService.unSharePost(userId, +parseInt(postId));

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

export const commentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await feedService.commentPost(userId, parseInt(postId), content);

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

export const deleteCommentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await feedService.deleteCommentPost(parseInt(commentId), userId);

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next();
  }
};
