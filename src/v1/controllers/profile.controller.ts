import { NextFunction, Response, Request } from "express";
import profileService, { ProfileService } from "../services/profile.service";
import HttpResponse from "../../HttpResponse";
import { UpdateProfileDto } from "../dtos/profile.dto";

class ProfileController {
  constructor(private profileService: ProfileService) {
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  public async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isSuccess, statusCode, message, data } =
        await this.profileService.getProfile(+id);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedField = <UpdateProfileDto["body"]>req.body;
      const { isSuccess, statusCode, message, data } =
        await this.profileService.updateProfile(+id, updatedField);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = req.file as Express.Multer.File;
      console.log(file);
      if (!file) {
        return res
          .status(400)
          .json(new HttpResponse(false, 400, "File not found", null));
      }

      const { isSuccess, statusCode, message, data } =
        await this.profileService.uploadAvatar(+id, file);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController(profileService);
