import cors from "cors";
import express, { Express, Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.route";
import errorHandler from "./middlewares/error-handler";
import profileRoute from "./routes/profile.route";
import { upload } from "./middlewares/upload";
import feedRoute from "./routes/feed.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

export const expressApp = (app: Express) => {
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(upload);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/profile", profileRoute);
  app.use("/api/v1/feed", feedRoute);
  app.use(errorHandler);
};
