import { prisma } from "../../index";

export class SharedPostRepository {
  constructor() {}

  public async createSharedPost(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.sharedPost.create({
      data: { userId, postId },
      include: {
        user: true,
        post: true,
      },
    });
  }

  public async getSharedPost(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }

    return await prisma.sharedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  public async getPostsUserShare(userId: number) {
    if (!userId) {
      return null;
    }
    return await prisma.sharedPost.findMany({
      where: {
        userId,
      },
      select: {
        post: {
          select: {
            _count: true,
            id: true,
          },
        },
      },
    });
  }

  public async getUserSharingPost(postId: number) {
    if (!postId) {
      return null;
    }
    return await prisma.sharedPost.findMany({
      where: {
        postId,
      },
      select: {
        user: {
          select: {
            _count: true,
            id: true,
            name: true,
          },
        },
      },
    });
  }

  public async deleteSharedPost(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.sharedPost.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }
}
