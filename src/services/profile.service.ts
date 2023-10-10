import { UpdateUserInput } from "../custom-type";
import { UserReposotory } from "../repositories/user.repository";
import { formateData } from "../utils/formate-data";
import cloudinary from "cloudinary";
import { unlinkSync } from "fs";
import config from "../config";

export class ProfileService {
  constructor(private userRepository: UserReposotory) {
    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.api_key,
      api_secret: config.cloudinary.api_secret,
      secure: true,
    });
  }

  async getProfile(id: number) {
    const userProfile = await this.userRepository.findUserById(id);
    if (!userProfile) {
      return formateData(false, 404, "User not found", null);
    }
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
    return formateData(true, 200, "Get Profile success", updatedUser);
  }

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const userProfile = await this.userRepository.findUserById(id);
    if (!userProfile) {
      return formateData(false, 404, "User not found", null);
    }
    console.log(userProfile.avatarPublicId);
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
    console.log(resCloudinary);
    unlinkSync(file.path);

    const data = await this.userRepository.updateUser(id, {
      avatar: resCloudinary.secure_url,
      avatarPublicId: resCloudinary.public_id,
    });

    return formateData(true, 200, "Upload avatar success", data);
  }
}
