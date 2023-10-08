import express from "express";
import {
  checkOtp,
  login,
  refreshToken,
  register,
  forgotPassword,
  sendOtp,
} from "../controllers/auth.controller";
import { validationResource } from "../middlewares/validation-resource";
import {
  loginSchema,
  sendOtpSchema,
  registerSchema,
  checkOtpSchema,
  resetPasswordSchema,
} from "../dtos/auth.dto";

const authRouter = express.Router();

authRouter.post("/register", validationResource(registerSchema), register);
authRouter.post("/login", validationResource(loginSchema), login);
authRouter.put("/refresh-token", refreshToken);
authRouter.put("/otp/send", validationResource(sendOtpSchema), sendOtp);
authRouter.post("/otp/check", validationResource(checkOtpSchema), checkOtp);
authRouter.put(
  "/forgot-password/:id",
  validationResource(resetPasswordSchema),
  forgotPassword
);

export default authRouter;
