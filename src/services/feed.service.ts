import { CreatePostInput, UpdatePostInput } from "../custom-type";
import { PostRepository } from "../repositories/post.repository";
import { formateData } from "../utils/formate-data";
import { CacheService } from "./cache.service";

export class FeedService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly cacheService: CacheService
  ) {}

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

  async createPost(input: CreatePostInput) {
    const post = await this.postRepository.createPost(input);

    if (!post) {
      return formateData(false, 400, "Create post fail", null);
    }
    const posts = await this.postRepository.findPosts();
    await this.cacheService.setData(`posts`, 3600, posts);

    return formateData(true, 201, "Create post success", post);
  }

  async updatePost(id: number, input: UpdatePostInput) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    const updatedPost = await this.postRepository.updatePost(id, input);
    await this.cacheService.setData(`posts:${id}`, 3600, updatedPost);
    const posts = await this.postRepository.findPosts();
    await this.cacheService.setData(`posts`, 3600, posts);

    return formateData(true, 200, "Update post success", updatedPost);
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
}
