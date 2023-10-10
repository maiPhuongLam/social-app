import { CreatePostInput, UpdatePostInput } from "../custom-type";
import { prisma } from "../index";

export class PostRepository {
  constructor() {}

  async findPosts() {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
    });
  }

  async findPostById(id: number) {
    return await prisma.post.findUnique({ where: { id } });
  }

  async createPost(data: CreatePostInput) {
    return await prisma.post.create({
      data,
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async updatePost(id: number, data: UpdatePostInput) {
    return await prisma.post.update({
      where: { id },
      data: { ...data, updatedAt: new Date(Date.now()) },
    });
  }

  async deletePost(id: number) {
    return await prisma.post.delete({ where: { id } });
  }
}
