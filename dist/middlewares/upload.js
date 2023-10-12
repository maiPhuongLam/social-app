"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./uploads"); // The 'uploads/' directory where files will be stored
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname); // Unique file name
        },
    }),
    fileFilter: (req, file, cb) => {
        // Define the allowed file types
        const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
        // Check if the uploaded file's MIME type is in the allowed types array
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(null, false); // Reject the file
        }
    },
}).single("avatar");
