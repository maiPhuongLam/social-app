import { CreatePostInput, UpdatePostInput } from "../custom-type";
import { PostRepository } from "../repositories/post.repository";
import { formateData } from "../utils/formate-data";

export class FeedService {
  constructor(private readonly postRepository: PostRepository) {
    this.postRepository = new PostRepository();
  }

  async getPost(id: number) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    return formateData(true, 200, "Fetch post success", post);
  }

  async getPosts() {
    const posts = await this.postRepository.findPosts();

    if (!posts.length) {
      return formateData(false, 404, "Posts not found", null);
    }

    return formateData(true, 200, "Fetch post success", posts);
  }

  async createPost(input: CreatePostInput) {
    const post = await this.postRepository.createPost(input);
    if (!post) {
      return formateData(false, 400, "Create post fail", null);
    }
    return formateData(true, 201, "Create post success", post);
  }

  async updatePost(id: number, input: UpdatePostInput) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    const updatedPost = await this.postRepository.updatePost(id, input);
    return formateData(true, 200, "Update post success", updatedPost);
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return formateData(false, 404, "Post not found", null);
    }

    const data = await this.postRepository.deletePost(id);
    return formateData(true, 200, "Delte post success", data);
  }
}
