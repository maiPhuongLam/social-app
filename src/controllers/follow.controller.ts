import { NextFunction, Response, Request } from "express";
import HttpResponse from "../HttpResponse";
import HttpException from "../HttpException";
import { FollowService } from "../services/follow.service";
import { FollowRepository } from "../repositories/follow.repository";
import { UserReposotory } from "../repositories/user.repository";
import { CacheService } from "../services/cache.service";
import { Redis } from "ioredis";

const followService = new FollowService(
  new FollowRepository(),
  new UserReposotory(),
  new CacheService(new Redis())
);

export const follow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { followedId } = req.params;
    const followingId = req.userId!;
    const { isSuccess, statusCode, message, data } = await followService.follow(
      parseInt(followedId),
      followingId
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

export const unfollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { followedId } = req.params;
    const followingId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await followService.unfollow(parseInt(followedId), followingId);

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
