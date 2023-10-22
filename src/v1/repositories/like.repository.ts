import { prisma } from "../../index";

export class LikeRepository {
  constructor() {}

  async createLike(userId: number, postId: number) {
    return await prisma.like.create({ data: { userId, postId } });
  }

  async getLikes() {
    return await prisma.like.findMany();
  }

  async getLike(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async deleteLike(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  }
}
