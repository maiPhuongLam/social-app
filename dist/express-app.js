"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const error_handler_1 = __importDefault(require("./middlewares/error-handler"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const upload_1 = require("./middlewares/upload");
const feed_route_1 = __importDefault(require("./routes/feed.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const follow_route_1 = __importDefault(require("./routes/follow.route"));
const expressApp = (app) => {
    app.use((0, cors_1.default)({ origin: "*" }));
    app.use(express_1.default.json());
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
    app.use(upload_1.upload);
    app.use("/api/v1/auth", auth_route_1.default);
    app.use("/api/v1/profile", profile_route_1.default);
    app.use("/api/v1/feed", feed_route_1.default);
    app.use("/api/v1/follows", follow_route_1.default);
    app.use(error_handler_1.default);
};
exports.expressApp = expressApp;
