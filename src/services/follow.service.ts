import { UpdateUserInput } from "../custom-type";
import { UserReposotory } from "../repositories/user.repository";
import { formateData } from "../utils/formate-data";
import cloudinary from "cloudinary";
import { unlinkSync } from "fs";
import config from "../config";
import { CacheService } from "./cache.service";
import { FollowRepository } from "../repositories/follow.repository";

export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserReposotory,
    private cacheService: CacheService
  ) {}

  async follow(followedId: number, followingId: number) {
    const exist = await this.followRepository.getFollow(
      followedId,
      followingId
    );

    if (exist) {
      return formateData(false, 403, "Action forbiden", null);
    }

    const follow = await this.followRepository.createFollow(
      followedId,
      followingId
    );

    if (!follow) {
      return formateData(false, 400, "Follow fail", null);
    }

    const userFollowing = await this.userRepository.findUserById(followingId);
    const userFollowed = await this.userRepository.findUserById(followedId);
    await this.cacheService.setData(
      `profiles:${userFollowing?.id}`,
      3600,
      userFollowing
    );
    await this.cacheService.setData(
      `profiles:${userFollowing?.id}`,
      3600,
      userFollowed
    );

    return formateData(true, 201, "Follow success", follow);
  }

  async unfollow(followedId: number, followingId: number) {
    const exist = await this.followRepository.getFollow(
      followedId,
      followingId
    );

    if (!exist) {
      return formateData(false, 403, "Follower not exist", null);
    }

    const result = await this.followRepository.deleteFollow(
      followedId,
      followingId
    );

    if (!result) {
      return formateData(false, 400, "Unfollow fail", null);
    }

    const userFollowing = await this.userRepository.findUserById(followingId);
    const userFollowed = await this.userRepository.findUserById(followedId);
    await this.cacheService.setData(
      `profiles:${userFollowing?.id}`,
      3600,
      userFollowing
    );
    await this.cacheService.setData(
      `profiles:${userFollowing?.id}`,
      3600,
      userFollowed
    );

    return formateData(true, 201, "unfollow success", null);
  }
}
