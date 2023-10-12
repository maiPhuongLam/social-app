"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("../HttpException"));
const HttpResponse_1 = __importDefault(require("../HttpResponse"));
const errorHandler = (error, req, res, next) => {
    if (error instanceof HttpException_1.default) {
        return res
            .status(error.statusCode)
            .json(new HttpResponse_1.default(error.statusCode, error.message, null));
    }
    else {
        // Handle generic server errors
        console.error(error);
        return res
            .status(500)
            .json(new HttpResponse_1.default(500, "Something went wrong", null));
    }
};
exports.default = errorHandler;
