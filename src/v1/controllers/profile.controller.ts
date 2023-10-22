import { NextFunction, Response, Request } from "express";
import { ProfileService } from "../services/profile.service";
import { UserReposotory } from "../repositories/user.repository";
import HttpResponse from "../../HttpResponse";
import HttpException from "../../HttpException";
import {
  GetProfileDto,
  UpdateProfileDto,
  UploadAvatarDto,
} from "../dtos/profile.dto";
import { CacheService } from "../services/cache.service";
import { Redis } from "ioredis";

const profileService = new ProfileService(
  new UserReposotory(),
  new CacheService(new Redis())
);

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { isSuccess, statusCode, message, data } =
      await profileService.getProfile(+id);

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

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedField = <UpdateProfileDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } =
      await profileService.updateProfile(+id, updatedField);

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

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const file = req.file as Express.Multer.File;
    console.log(file);
    if (!file) {
      throw new HttpException(400, "file not found");
    }

    const { isSuccess, statusCode, message, data } =
      await profileService.uploadAvatar(+id, file);

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
