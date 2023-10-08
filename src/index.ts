import express, { Express } from "express";
import { expressApp } from "./express-app";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const PORT = +process.env.SERVER_PORT! | 8000;
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
