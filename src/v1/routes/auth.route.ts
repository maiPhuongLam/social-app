import express from "express";
import authController from "../controllers/auth.controller";
import { validationResource } from "../middlewares/validation-resource";
import {
  loginSchema,
  sendOtpSchema,
  registerSchema,
  checkOtpSchema,
  resetPasswordSchema,
} from "../dtos/auth.dto";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validationResource(registerSchema),
  authController.register
);
authRouter.post(
  "/login",
  validationResource(loginSchema),
  authController.login
);
authRouter.put("/refresh-token", authController.refreshToken);
authRouter.put(
  "/otp/send",
  validationResource(sendOtpSchema),
  authController.sendOtp
);
authRouter.post(
  "/otp/check",
  validationResource(checkOtpSchema),
  authController.checkOtp
);
authRouter.put(
  "/forgot-password/:id",
  validationResource(resetPasswordSchema),
  authController.forgotPassword
);

export default authRouter;
