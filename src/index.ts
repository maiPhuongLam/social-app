import express, { Express } from "express";
import { expressApp } from "./express-app";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import dotenv from "dotenv";
import config from "./config";

const PORT = +config.port! | 8000;
dotenv.config();

const startApp = async (app: Express) => {
  try {
    expressApp(app);
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startApp(express());
