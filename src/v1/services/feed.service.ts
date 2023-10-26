import config from "../../config";
import { CreatePostInput, UpdatePostInput } from "../../custom-type";
import { CommentRepository } from "../repositories/comment.repository";
import { LikeRepository } from "../repositories/like.repository";
import { PostRepository } from "../repositories/post.repository";
import { SharedPostRepository } from "../repositories/sharedPost.repository";
import { formateData } from "../../utils/formate-data";
import cloudinary from "cloudinary";
import { unlinkSync } from "fs";
import client from "../../redis";
export class FeedService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly likeRepository: LikeRepository,
    private readonly commentRepository: CommentRepository,
    private readonly sharedPostRepository: SharedPostRepository
  ) {
    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.api_key,
      api_secret: config.cloudinary.api_secret,
      secure: true,
    });
  }

  public async getPost(id: number) {
    const cacheData = await client.lRange("posts", 0, -1);

    // Close the Redis connection when done (optional)
    if (cacheData) {
      console.log("Caching success");
      const posts = cacheData.map((data) => JSON.parse(data));
      const post = posts.find((post) => post.id === id);
      if (post) {
        return formateData(true, 200, "Fetch posts success", post);
      }
    }

    console.log("Cache empty");

    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    await client.lPush("posts", JSON.stringify(post));

    return formateData(true, 200, "Fetch post success", post);
  }

  public async getPosts() {
    const cacheData = await client.lRange("posts", 0, -1);

    if (cacheData.length > 0) {
      console.log("Caching success");
      const posts = cacheData.map((data) => JSON.parse(data));
      return formateData(true, 200, "Fetch posts success", posts);
    }

    console.log("Cache empty");
    const posts = await this.postRepository.findPosts();

    if (!posts.length) {
      return formateData(false, 404, "Posts not found", null);
    }
    for (let i = 0; i < posts.length; i++) {
      await client.lPush("posts", JSON.stringify(posts[i]));
    }

    return formateData(true, 200, "Fetch posts success", posts);
  }

  public async createPost(input: CreatePostInput, file: Express.Multer.File) {
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

        await client.lPush("posts", JSON.stringify(post));
        return formateData(true, 201, "Create post success", post);
      }
      const post = await this.postRepository.createPost(input);

      if (!post) {
        return formateData(false, 400, "Create post fail", null);
      }

      await client.lPush("posts", JSON.stringify(post));

      return formateData(true, 201, "Create post success", post);
    } else {
      return formateData(false, 400, "Create post fail", null);
    }
  }

  public async updatePost(
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
        const cacheData = await client.lRange("posts", 0, -1);
        const index = cacheData.findIndex(
          (data) => parseInt(JSON.parse(data).id) === post?.id
        );
        await client.lSet("posts", index, JSON.stringify(post));

        return formateData(true, 200, "Update post success", post);
      }

      const post = await this.postRepository.updatePost(id, input);
      const cacheData = await client.lRange("posts", 0, -1);
      const index = cacheData.findIndex(
        (data) => parseInt(JSON.parse(data).id) === post?.id
      );
      await client.lSet("posts", index, JSON.stringify(post));

      return formateData(true, 200, "Update post success", post);
    } else {
      return formateData(false, 400, "Update post fail", null);
    }
  }

  public async deletePost(id: number) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    const data = await this.postRepository.deletePost(id);
    const cacheData = await client.lRange("posts", 0, -1);
    const index = cacheData.findIndex(
      (data) => parseInt(JSON.parse(data).id) === id
    );
    const postToDelete = await client.lIndex("posts", index);
    await client.lRem("posts", 1, postToDelete!);
    return formateData(true, 200, "Delte post success", data);
  }

  public async likePost(userId: number, postId: number) {
    const postExist = await this.postRepository.findPostById(postId);
    if (!postExist) {
      return formateData(false, 403, "Action forbiden", null);
    }
    const exist = await this.likeRepository.getLike(userId, postId);

    if (exist) {
      return formateData(false, 403, "Action like is forbidden", null);
    }

    const like = await this.likeRepository.createLike(userId, postId);
    const cacheData = await client.lRange("posts", 0, -1);
    const index = cacheData.findIndex(
      (data) => parseInt(JSON.parse(data).id) === postId
    );
    const post = await this.postRepository.findPostById(postId);
    await client.lSet("posts", index, JSON.stringify(post));

    return formateData(true, 201, "Like post success", like);
  }

  public async dislikePost(userId: number, postId: number) {
    const postExist = await this.postRepository.findPostById(postId);

    if (!postExist) {
      return formateData(false, 403, "Action forbiden", null);
    }

    const exist = await this.likeRepository.getLike(userId, postId);

    if (!exist) {
      return formateData(false, 403, "Action like is forbidden", null);
    }

    const like = await this.likeRepository.deleteLike(userId, postId);
    const cacheData = await client.lRange("posts", 0, -1);
    const index = cacheData.findIndex(
      (data) => parseInt(JSON.parse(data).id) === postId
    );
    const post = await this.postRepository.findPostById(postId);
    await client.lSet("posts", index, JSON.stringify(post));

    return formateData(true, 201, "Dislike post success", like);
  }

  public async commentPost(userId: number, postId: number, content: string) {
    const postExist = await this.postRepository.findPostById(postId);

    if (!postExist) {
      return formateData(false, 403, "Action forbiden", null);
    }

    const comment = await this.commentRepository.createComment(
      userId,
      postId,
      content
    );
    const cacheData = await client.lRange("posts", 0, -1);
    const index = cacheData.findIndex(
      (data) => parseInt(JSON.parse(data).id) === postId
    );
    const post = await this.postRepository.findPostById(postId);
    await client.lSet("posts", index, JSON.stringify(post));

    return formateData(true, 201, "Comment post success", comment);
  }

  public async deleteCommentPost(
    commentId: number,
    userId: number,
    postId: number
  ) {
    const postExist = await this.postRepository.findPostById(postId);
    if (!postExist) {
      return formateData(false, 403, "Action forbiden", null);
    }
    console.log(postExist);
    const comment = await this.commentRepository.getComment(commentId);
    if (!comment) {
      return formateData(false, 404, "Action like is forbidden", null);
    }
    console.log(1);
    if (comment.userId !== userId) {
      return formateData(false, 401, "Unauthorized", null);
    }

    const data = await this.commentRepository.deleteComment(commentId);
    // const posts = await this.postRepository.findPosts();
    // const post = await this.postRepository.findPostById(id);
    // await this.cacheService.setData(`posts`, 3600, posts);
    // await this.cacheService.setData(`posts:${id}`, 3600, post);

    const cacheData = await client.lRange("posts", 0, -1);
    const index = cacheData.findIndex(
      (data) => parseInt(JSON.parse(data).id) === comment.postId
    );
    const post = await this.postRepository.findPostById(comment.postId);
    await client.lSet("posts", index, JSON.stringify(post));

    return formateData(true, 201, "Delete post success", data);
  }

  public async sharedPost(userId: number, postId: number) {
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
    // const posts = await this.postRepository.findPosts();
    // const post = await this.postRepository.findPostById(postId);
    // await this.cacheService.setData(`posts`, 3600, posts);
    // await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Shared post success", sharedPost);
  }

  public async unSharePost(userId: number, postId: number) {
    const exist = await this.sharedPostRepository.getSharedPost(userId, postId);

    if (!exist) {
      return formateData(false, 403, "Post not exist", null);
    }

    const data = await this.sharedPostRepository.deleteSharedPost(
      userId,
      postId
    );

    // const posts = await this.postRepository.findPosts();
    // const post = await this.postRepository.findPostById(postId);
    // await this.cacheService.setData(`posts`, 3600, posts);
    // await this.cacheService.setData(`posts:${postId}`, 3600, post);

    return formateData(true, 201, "Unshared post success", data);
  }
}

const feedService = new FeedService(
  new PostRepository(),
  new LikeRepository(),
  new CommentRepository(),
  new SharedPostRepository()
);
export default feedService;
