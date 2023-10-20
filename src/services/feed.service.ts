import config from "../config";
import { CreatePostInput, UpdatePostInput } from "../custom-type";
import { CommentRepository } from "../repositories/comment.repository";
import { LikeRepository } from "../repositories/like.repository";
import { PostRepository } from "../repositories/post.repository";
import { SharedPostRepository } from "../repositories/sharedPost.repository";
import { formateData } from "../utils/formate-data";
import { CacheService } from "./cache.service";
import cloudinary from "cloudinary";
import { unlinkSync } from "fs";

export class FeedService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly likeRepository: LikeRepository,
    private readonly commentRepository: CommentRepository,
    private readonly sharedPostRepository: SharedPostRepository,
    private readonly cacheService: CacheService
  ) {
    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.api_key,
      api_secret: config.cloudinary.api_secret,
      secure: true,
    });
  }

  async getPost(id: number) {
    const cache = await this.cacheService.getData(`posts:${id}`);

    if (cache.data) {
      console.log("Cache data success");
      return cache;
    }

    console.log("Miss cache");
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    await this.cacheService.setData(`posts:${id}`, 3600, post);

    return formateData(true, 200, "Fetch post success", post);
  }

  async getPosts() {
    const cache = await this.cacheService.getData("posts");

    if (cache.data) {
      console.log("Cache data success");
      return cache;
    }

    const posts = await this.postRepository.findPosts();

    if (!posts.length) {
      return formateData(false, 404, "Posts not found", null);
    }

    await this.cacheService.setData("posts", 3600, posts);

    return formateData(true, 200, "Fetch post success", posts);
  }

  async createPost(input: CreatePostInput, file: Express.Multer.File) {
    const { content, link, location } = input;

    if (file || content || link || location) {
      if (file) {
        const resCloudinary = await cloudinary.v2.uploader.upload(file.path, {
          folder: `${config.cloudinary.folderPath}/posts`,
          public_id: `${config.cloudinary.publicId_prefix}${Date.now()}`,
          transformation: [
            {
              width: "400x400".toString().split("x")[0],
              height: "400x400".toString().split("x")[1],
              crop: "fill",
            },
            {
              quality: "auto",
            },
          ],
        });
        unlinkSync(file.path);
        const post = await this.postRepository.createPost({
          ...input,
          image: resCloudinary.secure_url,
          imagePublicId: resCloudinary.public_id,
        });

        const posts = await this.postRepository.findPosts();
        await this.cacheService.setData(`posts`, 3600, posts);

        return formateData(true, 201, "Create post success", post);
      }
      const post = await this.postRepository.createPost(input);

      if (!post) {
        return formateData(false, 400, "Create post fail", null);
      }

      const posts = await this.postRepository.findPosts();
      await this.cacheService.setData(`posts`, 3600, posts);

      return formateData(true, 201, "Create post success", post);
    } else {
      return formateData(false, 400, "Create post fail", null);
    }
  }

  async updatePost(
    id: number,
    input: UpdatePostInput,
    image: Express.Multer.File
  ) {
    const postExist = await this.postRepository.findPostById(id);

    if (!postExist) {
      return formateData(false, 404, "Post not found", null);
    }

    const { content, link, location, published } = input;

    if (image || content || link || location || published !== undefined) {
      console.log(1);
      if (image && postExist.imagePublicId) {
        await cloudinary.v2.uploader.destroy(postExist.imagePublicId, {
          invalidate: true,
        });
      }
      if (image) {
        const resCloudinary = await cloudinary.v2.uploader.upload(image.path, {
          folder: `${config.cloudinary.folderPath}/posts`,
          public_id: `${config.cloudinary.publicId_prefix}${Date.now()}`,
          transformation: [
            {
              width: "400x400".toString().split("x")[0],
              height: "400x400".toString().split("x")[1],
              crop: "fill",
            },
            {
              quality: "auto",
            },
          ],
        });
        unlinkSync(image.path);
        const post = await this.postRepository.updatePost(id, {
          ...input,
          image: resCloudinary.secure_url,
          imagePublicId: resCloudinary.public_id,
        });

        const posts = await this.postRepository.findPosts();
        this.cacheService.setData(`posts`, 3600, posts);
        this.cacheService.setData(`posts:${post?.id}`, 3600, post);

        return formateData(true, 200, "Update post success", post);
      }

      const post = await this.postRepository.updatePost(id, input);
      const posts = await this.postRepository.findPosts();
      this.cacheService.setData(`posts`, 3600, posts);
      this.cacheService.setData(`posts:${post?.id}`, 3600, post);

      return formateData(true, 200, "Update post success", post);
    } else {
      return formateData(false, 400, "Update post fail", null);
    }
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    const data = await this.postRepository.deletePost(id);
    await this.cacheService.deleteData(`posts:${id}`);
    const posts = await this.postRepository.findPosts();
    await this.cacheService.setData(`posts`, 3600, posts);

    return formateData(true, 200, "Delte post success", data);
  }

  async likePost(userId: number, postId: number) {
    const exist = await this.likeRepository.getLike(userId, postId);

    if (exist) {
      return formateData(false, 403, "Action like is forbidden", null);
    }

    const like = await this.likeRepository.createLike(userId, postId);
    const posts = await this.postRepository.findPosts();
    const post = await this.postRepository.findPostById(postId);
    await this.cacheService.setData(`posts`, 3600, posts);
    await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Like post success", like);
  }

  async dislikePost(userId: number, postId: number) {
    const exist = await this.likeRepository.getLike(userId, postId);

    if (!exist) {
      return formateData(false, 403, "Action like is forbidden", null);
    }

    const like = await this.likeRepository.deleteLike(userId, postId);
    const posts = await this.postRepository.findPosts();
    const post = await this.postRepository.findPostById(postId);
    await this.cacheService.setData(`posts`, 3600, posts);
    await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Dislike post success", like);
  }

  async commentPost(userId: number, postId: number, content: string) {
    const comment = await this.commentRepository.createComment(
      userId,
      postId,
      content
    );
    const posts = await this.postRepository.findPosts();
    const post = await this.postRepository.findPostById(postId);
    await this.cacheService.setData(`posts`, 3600, posts);
    await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Comment post success", comment);
  }

  async deleteCommentPost(id: number, userId: number) {
    const comment = await this.commentRepository.getComment(id);

    if (!comment) {
      return formateData(false, 404, "Action like is forbidden", null);
    }
    console.log(comment.userId);
    console.log(userId);
    if (comment.userId !== userId) {
      return formateData(false, 401, "Unauthorized", null);
    }

    const data = await this.commentRepository.deleteComment(id);
    const posts = await this.postRepository.findPosts();
    const post = await this.postRepository.findPostById(id);
    await this.cacheService.setData(`posts`, 3600, posts);
    await this.cacheService.setData(`posts:${id}`, 3600, post);

    return formateData(true, 201, "Delete post success", data);
  }

  async sharedPost(userId: number, postId: number) {
    const exist = await this.sharedPostRepository.getSharedPost(userId, postId);

    if (exist) {
      return formateData(false, 403, "Action like is forbidden", null);
    }

    const sharedPost = await this.sharedPostRepository.createSharedPost(
      userId,
      postId
    );

    if (!sharedPost) {
      return formateData(false, 400, "Share post fail", null);
    }
    // const newPost = await this.postRepository.createPost({
    //   title: sharedPost?.post.title,
    //   authorId: sharedPost?.post.authorId,
    //   content: sharedPost.post.content,
    //   published: true
    // })
    const posts = await this.postRepository.findPosts();
    const post = await this.postRepository.findPostById(postId);
    await this.cacheService.setData(`posts`, 3600, posts);
    await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Shared post success", sharedPost);
  }

  async unSharePost(userId: number, postId: number) {
    const exist = await this.sharedPostRepository.getSharedPost(userId, postId);

    if (!exist) {
      return formateData(false, 403, "Post not exist", null);
    }

    const data = await this.sharedPostRepository.deleteSharedPost(
      userId,
      postId
    );

    const posts = await this.postRepository.findPosts();
    const post = await this.postRepository.findPostById(postId);
    await this.cacheService.setData(`posts`, 3600, posts);
    await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Unshared post success", data);
  }
}
