import { Request, Response, NextFunction } from "express";
import HttpException from "../../HttpException";
import HttpResponse from "../../HttpResponse";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = error.message || "Something went wrong";
  return res.status(500).json(new HttpResponse(false, 500, message, null));
};

export default errorHandler;
