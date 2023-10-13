import { CreatePostInput, UpdatePostInput } from "../custom-type";
import { prisma } from "../index";

export class PostRepository {
  constructor() {}

  private select = {
    _count: true,
    id: true,
    title: true,
    content: true,
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
    createdAt: true,
    updatedAt: true,
  };

  async findPosts() {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      select: this.select,
    });
  }

  async findPostById(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.post.findUnique({
      where: { id },
      select: this.select,
    });
  }

  async createPost(data: CreatePostInput) {
    return await prisma.post.create({
      data,
      select: this.select,
    });
  }

  async updatePost(id: number, data: UpdatePostInput) {
    if (!id) {
      return null;
    }
    return await prisma.post.update({
      where: { id },
      data: { ...data, updatedAt: new Date(Date.now()) },
      select: this.select,
    });
  }

  async deletePost(id: number) {
    return await prisma.post.delete({
      where: { id },
      select: {
        _count: true,
        id: true,
        title: true,
        content: true,
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
                comments: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
