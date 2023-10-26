import { prisma } from "../../index";

export class CommentRepository {
  constructor() {}

  public async createComment(userId: number, postId: number, content: string) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.comment.create({ data: { userId, postId, content } });
  }

  public async getComents() {
    return await prisma.comment.findMany();
  }

  public async getComment(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.comment.findUnique({
      where: { id },
      select: { postId: true, userId: true, content: true },
    });
  }

  public async deleteComment(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.comment.delete({
      where: { id },
    });
  }
}
