import { NextFunction, Response, Request } from "express";
import HttpResponse from "../../HttpResponse";
import HttpException from "../../HttpException";
import followService, { FollowService } from "../services/follow.service";

class FollowController {
  constructor(private followService: FollowService) {
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  public async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const { followedId } = req.params;
      const followingId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.followService.follow(parseInt(followedId), followingId);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const { followedId } = req.params;
      const followingId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.followService.unfollow(parseInt(followedId), followingId);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }
}

export default new FollowController(followService);
