import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/auth-token";
import HttpResponse from "../HttpResponse";
import config from "../config";
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json(new HttpResponse(401, "Unauthorized", null));
  }

  const token = authHeader.split(" ")[1];
  let decode;

  try {
    decode = (await validateToken(token, config.jwt.accessKey)) as {
      id: number;
      email: string;
    };
  } catch (error) {
    return res.status(401).json(new HttpResponse(401, "Unauthorized", null));
  }

  if (!decode) {
    return res.status(401).json(new HttpResponse(401, "Unauthorized", null));
  }

  req.userId = decode.id;
  next();
};
