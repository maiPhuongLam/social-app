import { prisma } from "../index";

export class FollowRepository {
  constructor() {}

  async createFollow(followerId: number, followingId: number) {
    return await prisma.follow.create({ data: { followerId, followingId } });
  }

  async deleteFollow(followerId: number, followingId: number) {
    return await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
