import { prisma } from "../../index";

export class LikeRepository {
  constructor() {}

  public async createLike(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.like.create({ data: { userId, postId } });
  }

  public async getLikes() {
    return await prisma.like.findMany();
  }

  public async getLike(userId: number, postId: number) {
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

  public async deleteLike(userId: number, postId: number) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  }
}
