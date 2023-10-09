import { User } from "@prisma/client";
import { FormateData, UserCreateInput, UserLoginInput } from "../custom-type";
import { UserReposotory } from "../repositories/user.repository";
import { hashPassword, validatePassword } from "../utils/password";
import HttpException from "../HttpException";
import { formateData } from "../utils/formate-data";
import { generateToken, validateToken } from "../utils/auth-token";
import { sendEmail } from "../utils/mail-handler";
import config from "../config";
// import * as speakeasy from "speakeasy";
// import * as qr from "qrcode";

export class AuthService {
  constructor(private userRepository: UserReposotory) {
    this.userRepository = new UserReposotory();
  }

  async login(input: UserLoginInput): Promise<FormateData> {
    const user = await this.userRepository.findUserByEmail(input.email);

    if (!user) {
      return formateData(false, 401, "Email or password incorrect", null);
    }

    const checkPassword = await validatePassword(input.password, user.password);

    if (!checkPassword) {
      return formateData(false, 401, "Email or password incorrect", null);
    }

    const accessToken = await generateToken(
      { id: user.id, email: user.email },
      config.jwt.accessKey
    );

    const refreshToken = await generateToken(
      { id: user.id, email: user.email },
      config.jwt.refreshKey
    );

    return formateData(true, 200, "User login success", {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async register(input: UserCreateInput): Promise<FormateData> {
    const existedUser = await this.userRepository.findUserByEmail(input.email);
    if (existedUser) {
      return formateData(
        false,
        409,
        "Email has been used register an other account",
        null
      );
    }

    input.password = await hashPassword(input.password);

    const user = await this.userRepository.createUser(input);

    const accessToken = await generateToken(
      { id: user.id, email: user.email },
      config.jwt.accessKey
    );

    const refreshToken = await generateToken(
      { id: user.id, email: user.email },
      config.jwt.refreshKey
    );

    return formateData(true, 201, "User register success", {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async getNewToken(refreshToken: string) {
    const token = await validateToken(refreshToken, config.jwt.refreshKey);
    const newAcessToken = await generateToken(
      { id: token.id, email: token.email },
      config.jwt.accessKey
    );

    return formateData(true, 200, "Refresh token success", {
      access_token: newAcessToken,
    });
  }

  async sendOtp(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return formateData(false, 404, "Email incorrect", null);
    }
    // const otpStorage: { [key: string]: { secret: string; expiresAt: number } } = {};
    // const secret = speakeasy.generateSecret()
    // otpStorage[email] = {
    //   secret: secret.base32,
    //   expiresAt: Date.now() + 60000,
    // };
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 1);

    await this.userRepository.updateUser(user.id, { otp, otpExpiryTime });

    sendEmail(user.email, "YOUR OTP CODE", `<p>${otp}</p>`);

    return formateData(true, 200, "Send otp mail success", null);
  }

  async checkOtp(otp: number) {
    const user = await this.userRepository.findUserByOtp(otp);
    if (!user) {
      return formateData(false, 404, "Invalid Otp", null);
    }
    const currentTime = new Date(Date.now());
    if (user.otpExpiryTime! < currentTime) {
      return formateData(false, 404, "Invalid Otp", null);
    }

    return formateData(true, 200, "Otp is valid", user.id);
  }

  async resetPassword(id: number, password: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      return formateData(false, 404, "User not found", null);
    }

    const newPassword = await hashPassword(password);
    await this.userRepository.updateUser(user.id, { password: newPassword });

    return formateData(true, 200, "Reset password success", null);
  }
}
