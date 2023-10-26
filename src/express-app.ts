import cors from "cors";
import express, { Express, Request, Response, NextFunction } from "express";
import authRouter from "./v1/routes/auth.route";
import errorHandler from "./v1/middlewares/error-handler";
import profileRoute from "./v1/routes/profile.route";
import { upload } from "./v1/middlewares/upload";
import feedRoute from "./v1/routes/feed.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import followRoute from "./v1/routes/follow.route";
import addressRoute from "./v1/routes/address.route";

export const expressApp = (app: Express) => {
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(upload);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/profile", profileRoute);
  app.use("/api/v1/feed", feedRoute);
  app.use("/api/v1/follows", followRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use(errorHandler);
};
