import { NextFunction, Response, Request } from "express";
import authService, { AuthService } from "../services/auth.service";
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

class AuthController {
  constructor(private authService: AuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.register.bind(this);
    this.sendOtp = this.sendOtp.bind(this);
    this.checkOtp = this.checkOtp.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <RegisterDto["body"]>req.body;
      const { data, message, statusCode, isSuccess } =
        await this.authService.register({
          ...body,
          dateOfBirth: new Date(body.dateOfBirth),
          type: UserTypes.USER,
        });

      res.cookie("_auth_token_", data.refresh_token, {
        httpOnly: true,
      });

      return res
        .status(201)
        .json(
          new HttpResponse(isSuccess, statusCode, message, data.access_token)
        );
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = <LoginDto["body"]>req.body;
      const { isSuccess, statusCode, message, data } =
        await this.authService.login({
          email,
          password,
        });

      res.cookie("_auth_token_", data.refresh_token, {
        httpOnly: true,
      });

      return res
        .status(201)
        .json(
          new HttpResponse(isSuccess, statusCode, message, data.access_token)
        );
    } catch (error) {
      next(error);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = <string>req.cookies._auth_token_;

      if (!token) {
        throw new HttpException(401, "Unauthorized");
      }

      const { isSuccess, statusCode, message, data } =
        await this.authService.getNewToken(token);

      return res
        .status(201)
        .json(
          new HttpResponse(isSuccess, statusCode, message, data.access_token)
        );
    } catch (error) {
      next(error);
    }
  }

  public async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = <SendOtpDto["body"]>req.body;
      const { isSuccess, statusCode, message, data } =
        await this.authService.sendOtp(email);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async checkOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = <CheckOtpDto["body"]>req.body;
      const { isSuccess, statusCode, message, data } =
        await this.authService.checkOtp(+otp);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = <ResetPasswordDto["params"]>req.params;
      const { password } = <ResetPasswordDto["body"]>req.body;
      const { isSuccess, statusCode, message, data } =
        await this.authService.resetPassword(+id, password);

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController(authService);
