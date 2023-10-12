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
exports.auth = void 0;
const auth_token_1 = require("../utils/auth-token");
const HttpResponse_1 = __importDefault(require("../HttpResponse"));
const config_1 = __importDefault(require("../config"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json(new HttpResponse_1.default(401, "Unauthorized", null));
    }
    const token = authHeader.split(" ")[1];
    let decode;
    try {
        decode = (yield (0, auth_token_1.validateToken)(token, config_1.default.jwt.accessKey));
    }
    catch (error) {
        return res.status(401).json(new HttpResponse_1.default(401, "Unauthorized", null));
    }
    if (!decode) {
        return res.status(401).json(new HttpResponse_1.default(401, "Unauthorized", null));
    }
    req.userId = decode.id;
    next();
});
exports.auth = auth;
