import { query } from "express";
import { prisma } from "../index";
import { UserCreateInput, UserQuery, UserUpdateInput } from "../interface";
export class UserReposotory {
  constructor() {}

  async createUser(query: UserCreateInput) {
    return await prisma.user.create({
      data: {
        email: query.email,
        name: query.name,
        type: "USER",
        password: query.password,
        otp: Math.floor(Math.random() * 900000) + 100000,
      },
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async findAllUser() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async findUserByQuery(query: UserQuery) {
    return await prisma.user.findMany({
      where: query,
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        type: true,
        otp: true,
        createdAt: true,
      },
    });
  }

  async findUserById(id: number) {
    return await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async findUserByOtp(otp: number) {
    return await prisma.user.findFirst({
      where: { otp },
      orderBy: { updatedAt: "desc" },
    });
  }

  async updateUser(id: number, data: UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(Date.now()),
      },
      select: {
        id: true,
        email: true,
        name: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async removeUser(id: number) {
    return await prisma.user.delete({ where: { id } });
  }
}
