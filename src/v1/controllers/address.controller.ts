import { NextFunction, Response, Request } from "express";
import { UserReposotory } from "../repositories/user.repository";
import HttpResponse from "../../HttpResponse";
import HttpException from "../../HttpException";
import { CacheService } from "../services/cache.service";
import { Redis } from "ioredis";
import { AddressService } from "../services/address.service";
import { AddressRepository } from "../repositories/address.repository";
import { CreateAddressDto, UpdateAddressDto } from "../dtos/address.dto";

const addressService = new AddressService(
  new UserReposotory(),
  new AddressRepository(),
  new CacheService(new Redis())
);

export const getAddreses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { isSuccess, statusCode, message, data } =
      await addressService.getAddressesByUserId(parseInt(userId));

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const body = <CreateAddressDto["body"]>req.body;
    const { isSuccess, statusCode, message, data } =
      await addressService.createAddress({ userId, ...body });

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { addressId } = req.params;
    const body = <UpdateAddressDto["body"]>req.body;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await addressService.updateAddress(parseInt(addressId), {
        userId,
        ...body,
      });

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { addressId } = req.params;
    const userId = req.userId!;
    const { isSuccess, statusCode, message, data } =
      await addressService.deleteAddress(userId, parseInt(addressId));

    if (!isSuccess) {
      throw new HttpException(statusCode, message);
    }

    return res
      .status(statusCode)
      .json(new HttpResponse(statusCode, message, data));
  } catch (error) {
    next(error);
  }
};
