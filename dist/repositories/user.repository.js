"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReposotory = void 0;
const index_1 = require("../index");
class UserReposotory {
    constructor() { }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.create({
                data: Object.assign(Object.assign({}, data), { type: "USER", otp: Math.floor(Math.random() * 900000) + 100000 }),
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    dateOfBirth: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
    }
    findAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    type: true,
                    gender: true,
                    dateOfBirth: true,
                    phone: true,
                    createdAt: true,
                },
            });
        });
    }
    findUserByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.findMany({
                where: query,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    type: true,
                    gender: true,
                    dateOfBirth: true,
                    phone: true,
                    createdAt: true,
                },
            });
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.findFirst({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    password: true,
                    type: true,
                    gender: true,
                    dateOfBirth: true,
                    phone: true,
                    otp: true,
                    createdAt: true,
                },
            });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    type: true,
                    gender: true,
                    dateOfBirth: true,
                    avatar: true,
                    avatarPublicId: true,
                    phone: true,
                    createdAt: true,
                },
            });
        });
    }
    findUserByOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.findFirst({
                where: { otp },
                orderBy: { updatedAt: "desc" },
                select: {
                    id: true,
                    otpExpiryTime: true,
                },
            });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { updatedAt: new Date(Date.now()) }),
                select: {
                    id: true,
                    avatar: true,
                },
            });
        });
    }
    removeUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.prisma.user.delete({ where: { id } });
        });
    }
}
exports.UserReposotory = UserReposotory;
