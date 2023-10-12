"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formateData = void 0;
const formateData = (isSuccess, statusCode, message, data) => {
    return {
        isSuccess,
        statusCode,
        message,
        data,
    };
};
exports.formateData = formateData;
