import { CreatePostInput, UpdatePostInput } from "../../custom-type";
import { prisma } from "../../index";

export class PostRepository {
  constructor() {}

  private select = {
    _count: true,
    id: true,
    content: true,
    image: true,
    imagePublicId: true,
    link: true,
    location: true,
    author: {
      select: {
        id: true,
        name: true,
      },
    },
    published: true,
    likes: {
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    comments: {
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        content: true,
      },
    },
    shares: {
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    createdAt: true,
    updatedAt: true,
  };

  public async findPosts() {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      select: this.select,
    });
  }

  public async findPostById(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.post.findUnique({
      where: { id },
      select: this.select,
    });
  }

  public async createPost(data: CreatePostInput) {
    return await prisma.post.create({
      data,
      select: this.select,
    });
  }

  public async updatePost(id: number, data: UpdatePostInput) {
    if (!id) {
      return null;
    }
    return await prisma.post.update({
      where: { id },
      data: { ...data, updatedAt: new Date(Date.now()) },
      select: this.select,
    });
  }

  public async deletePost(id: number) {
    return await prisma.post.delete({
      where: { id },
      select: this.select,
    });
  }
}
