import { prisma } from "../index";

export class FollowRepository {
  constructor() {}

  async getFollow(followedId: number, followingId: number) {
    if (!followedId || !followingId) {
      return null;
    }

    return await prisma.follow.findUnique({
      where: {
        followedId_followingId: {
          followedId,
          followingId,
        },
      },
    });
  }

  async getFollowers(userId: number) {
    if (!userId) {
      return null;
    }

    return prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        followed: {
          select: {
            _count: true,
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getFollowerings(userId: number) {
    if (!userId) {
      return null;
    }

    return prisma.follow.findMany({
      where: { followedId: userId },
      include: {
        following: {
          select: {
            _count: true,
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createFollow(followedId: number, followingId: number) {
    return await prisma.follow.create({ data: { followedId, followingId } });
  }

  async deleteFollow(followedId: number, followingId: number) {
    return await prisma.follow.delete({
      where: {
        followedId_followingId: {
          followedId,
          followingId,
        },
      },
    });
  }
}
