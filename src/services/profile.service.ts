import { UpdateUserInput } from "../custom-type";
import { UserReposotory } from "../repositories/user.repository";
import { formateData } from "../utils/formate-data";
import cloudinary from "cloudinary";
import { unlinkSync } from "fs";
import config from "../config";
import { CacheService } from "./cache.service";

export class ProfileService {
  constructor(
    private userRepository: UserReposotory,
    private cacheService: CacheService
  ) {
    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.api_key,
      api_secret: config.cloudinary.api_secret,
      secure: true,
    });
  }

  async getProfile(id: number) {
    const cache = await this.cacheService.getData(`profiles:${id}`);

    if (cache.data) {
      console.log("Cache data success");
      return cache;
    }

    const userProfile = await this.userRepository.findUserById(id);

    if (!userProfile) {
      return formateData(false, 404, "User not found", null);
    }

    await this.cacheService.setData(`profiles:${id}`, 3600, userProfile);

    return formateData(true, 200, "Get Profile success", {
      ...userProfile,
      dateOfBirth: userProfile.dateOfBirth.toLocaleDateString(),
    });
  }

  async updateProfile(id: number, input: UpdateUserInput) {
    const userProfile = await this.userRepository.findUserById(id);

    if (!userProfile) {
      return formateData(false, 404, "User not found", null);
    }

    const updatedUser = await this.userRepository.updateUser(id, input);
    await this.cacheService.setData(`profiles:${id}`, 3600, updatedUser);

    return formateData(true, 200, "Get Profile success", updatedUser);
  }

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const userProfile = await this.userRepository.findUserById(id);

    if (!userProfile) {
      return formateData(false, 404, "User not found", null);
    }

    if (userProfile.avatar && userProfile.avatarPublicId) {
      await cloudinary.v2.uploader.destroy(userProfile.avatarPublicId, {
        invalidate: true,
      });
    }

    const resCloudinary = await cloudinary.v2.uploader.upload(file.path, {
      folder: config.cloudinary.folderPath,
      public_id: `${config.cloudinary.publicId_prefix}${Date.now()}`,
      transformation: [
        {
          width: "400x400".toString().split("x")[0],
          height: "400x400".toString().split("x")[1],
          crop: "fill",
        },
        {
          quality: "auto",
        },
      ],
    });

    unlinkSync(file.path);

    const data = await this.userRepository.updateUser(id, {
      avatar: resCloudinary.secure_url,
      avatarPublicId: resCloudinary.public_id,
    });
    await this.cacheService.setData(`profiles:${id}`, 3600, data);

    return formateData(true, 200, "Upload avatar success", data);
  }
}
