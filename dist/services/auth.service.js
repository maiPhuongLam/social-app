"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const password_1 = require("../utils/password");
const formate_data_1 = require("../utils/formate-data");
const auth_token_1 = require("../utils/auth-token");
const mail_handler_1 = require("../utils/mail-handler");
const config_1 = __importDefault(require("../config"));
// import * as speakeasy from "speakeasy";
// import * as qr from "qrcode";
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.userRepository = new user_repository_1.UserReposotory();
    }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(input.email);
            if (!user) {
                return (0, formate_data_1.formateData)(false, 401, "Email or password incorrect", null);
            }
            const checkPassword = yield (0, password_1.validatePassword)(input.password, user.password);
            if (!checkPassword) {
                return (0, formate_data_1.formateData)(false, 401, "Email or password incorrect", null);
            }
            const accessToken = yield (0, auth_token_1.generateToken)({ id: user.id, email: user.email }, config_1.default.jwt.accessKey);
            const refreshToken = yield (0, auth_token_1.generateToken)({ id: user.id, email: user.email }, config_1.default.jwt.refreshKey);
            return (0, formate_data_1.formateData)(true, 200, "User login success", {
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        });
    }
    register(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedUser = yield this.userRepository.findUserByEmail(input.email);
            if (existedUser) {
                return (0, formate_data_1.formateData)(false, 409, "Email has been used register an other account", null);
            }
            input.password = yield (0, password_1.hashPassword)(input.password);
            const user = yield this.userRepository.createUser(input);
            const accessToken = yield (0, auth_token_1.generateToken)({ id: user.id, email: user.email }, config_1.default.jwt.accessKey);
            const refreshToken = yield (0, auth_token_1.generateToken)({ id: user.id, email: user.email }, config_1.default.jwt.refreshKey);
            return (0, formate_data_1.formateData)(true, 201, "User register success", {
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        });
    }
    getNewToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield (0, auth_token_1.validateToken)(refreshToken, config_1.default.jwt.refreshKey);
            const newAcessToken = yield (0, auth_token_1.generateToken)({ id: token.id, email: token.email }, config_1.default.jwt.accessKey);
            return (0, formate_data_1.formateData)(true, 200, "Refresh token success", {
                access_token: newAcessToken,
            });
        });
    }
    sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                return (0, formate_data_1.formateData)(false, 404, "Email incorrect", null);
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
            yield this.userRepository.updateUser(user.id, { otp, otpExpiryTime });
            (0, mail_handler_1.sendEmail)(user.email, "YOUR OTP CODE", `<p>${otp}</p>`);
            return (0, formate_data_1.formateData)(true, 200, "Send otp mail success", null);
        });
    }
    checkOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByOtp(otp);
            if (!user) {
                return (0, formate_data_1.formateData)(false, 404, "Invalid Otp", null);
            }
            const currentTime = new Date(Date.now());
            if (user.otpExpiryTime < currentTime) {
                return (0, formate_data_1.formateData)(false, 404, "Invalid Otp", null);
            }
            return (0, formate_data_1.formateData)(true, 200, "Otp is valid", user.id);
        });
    }
    resetPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserById(id);
            if (!user) {
                return (0, formate_data_1.formateData)(false, 404, "User not found", null);
            }
            const newPassword = yield (0, password_1.hashPassword)(password);
            yield this.userRepository.updateUser(user.id, { password: newPassword });
            return (0, formate_data_1.formateData)(true, 200, "Reset password success", null);
        });
    }
}
exports.AuthService = AuthService;
