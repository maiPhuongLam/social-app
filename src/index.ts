import express, { Express } from "express";
import { expressApp } from "./express-app";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import dotenv from "dotenv";
import config from "./config";
const PORT = +config.port! | 8000;
dotenv.config();
const startApp = async (app: Express) => {
  expressApp(app);

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

startApp(express())
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
