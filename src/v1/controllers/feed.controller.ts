import { NextFunction, Response, Request } from "express";
import feedService, { FeedService } from "../services/feed.service";
import HttpResponse from "../../HttpResponse";
import HttpException from "../../HttpException";
import { CreatPostDto, UpdatePostDto } from "../dtos/post.dto";

class FeedController {
  constructor(private feedService: FeedService) {
    this.getListPosts = this.getListPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.getPost = this.getPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.likePost = this.likePost.bind(this);
    this.sharePost = this.sharePost.bind(this);
    this.unSharePost = this.unSharePost.bind(this);
    this.commentPost = this.commentPost.bind(this);
    this.deleteCommentPost = this.deleteCommentPost.bind(this);
  }

  public async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <CreatPostDto["body"]>req.body;
      const { authorId, published } = body;
      const image = req.file as Express.Multer.File;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.createPost(
          {
            ...body,
            authorId: Number(authorId),
            published: JSON.parse(published),
          },
          image
        );

      if (!isSuccess) {
        return new HttpException(statusCode, message);
      }

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.getPost(parseInt(id));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async getListPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { isSuccess, statusCode, message, data } =
        await this.feedService.getPosts();

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = <UpdatePostDto["body"]>req.body;
      const { published } = body;
      const image = req.file as Express.Multer.File;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.updatePost(
          parseInt(id),
          {
            ...body,
            published: published ? JSON.parse(published) : undefined,
          },
          image
        );

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.deletePost(parseInt(id));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.likePost(userId, parseInt(postId));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async dislikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.dislikePost(userId, parseInt(postId));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async sharePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.sharedPost(userId, +parseInt(postId));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async unSharePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.unSharePost(userId, +parseInt(postId));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async commentPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.commentPost(userId, parseInt(postId), content);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async deleteCommentPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { postId, commentId } = req.params;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.feedService.deleteCommentPost(
          parseInt(commentId),
          userId,
          parseInt(postId)
        );

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }
}

export default new FeedController(feedService);
