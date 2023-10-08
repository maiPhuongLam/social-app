import { NextFunction, Response, Request } from "express";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getListPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const dislikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const sharePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const commentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteCommentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
