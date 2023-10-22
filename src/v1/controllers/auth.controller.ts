import { NextFunction, Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { UserTypes } from "../../custom-type";
import HttpResponse from "../../HttpResponse";
import HttpException from "../../HttpException";
import {
  CheckOtpDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendOtpDto,
} from "../dtos/auth.dto";
import { UserReposotory } from "../repositories/user.repository";
const authService = new AuthService(new UserReposotory());

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = <RegisterDto["body"]>req.body;
    const { data, message, statusCode, isSuccess } = await authService.register(
      {
        ...body,
        dateOfBirth: new Date(body.dateOfBirth),
        type: UserTypes.USER,
      }
    );

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    res.cookie("_auth_token_", data.refresh_token, {
      httpOnly: true,
    });

    return res
      .status(201)
      .json(new HttpResponse(statusCode, message, data.access_token));
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = <LoginDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } = await authService.login({
      email,
      password,
    });

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    res.cookie("_auth_token_", data.refresh_token, {
      httpOnly: true,
    });

    return res
      .status(201)
      .json(new HttpResponse(statusCode, message, data.access_token));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = <string>req.cookies._auth_token_;

    if (!token) {
      throw new HttpException(401, "Unauthorized");
    }

    const { isSuccess, statusCode, message, data } =
      await authService.getNewToken(token);

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(201)
      .json(new HttpResponse(statusCode, message, data.access_token));
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = <SendOtpDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } = await authService.sendOtp(
      email
    );

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const checkOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = <CheckOtpDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } = await authService.checkOtp(
      +otp
    );

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = <ResetPasswordDto["params"]>req.params;
    const { password } = <ResetPasswordDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } =
      await authService.resetPassword(+id, password);

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};
