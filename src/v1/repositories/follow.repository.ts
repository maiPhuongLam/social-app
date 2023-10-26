import { prisma } from "../../index";

export class FollowRepository {
  constructor() {}

  public async getFollow(followedId: number, followingId: number) {
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

  public async getFollowers(userId: number) {
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

  public async getFollowerings(userId: number) {
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

  public async createFollow(followedId: number, followingId: number) {
    return await prisma.follow.create({ data: { followedId, followingId } });
  }

  public async deleteFollow(followedId: number, followingId: number) {
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
