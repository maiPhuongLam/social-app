import { NextFunction, Response, Request } from "express";
import { ProfileService } from "../services/profile.service";
import { UserReposotory } from "../repositories/user.repository";
import HttpResponse from "../HttpResponse";
import HttpException from "../HttpException";
import {
  GetProfileDto,
  UpdateProfileDto,
  UploadAvatarDto,
} from "../dtos/profile.dto";

const profileService = new ProfileService(new UserReposotory());

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = <GetProfileDto["params"]>req.params;
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
    const { id } = <UpdateProfileDto["params"]>req.params;
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
    const { id } = <UploadAvatarDto["params"]>req.params;
    const file = req.file as Express.Multer.File;

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
