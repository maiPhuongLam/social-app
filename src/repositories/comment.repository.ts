import { prisma } from "../index";

export class CommentRepository {
  constructor() {}

  async createComment(userId: number, postId: number, content: string) {
    if (!userId || !postId) {
      return null;
    }
    return await prisma.comment.create({ data: { userId, postId, content } });
  }

  async getComents() {
    return await prisma.comment.findMany();
  }

  async getComment(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.comment.findUnique({ where: { id } });
  }

  async deleteComment(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.comment.delete({
      where: { id },
    });
  }
}
