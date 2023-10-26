import { NextFunction, Response, Request } from "express";
import { UserReposotory } from "../repositories/user.repository";
import HttpResponse from "../../HttpResponse";
import addressService, { AddressService } from "../services/address.service";
import { CreateAddressDto, UpdateAddressDto } from "../dtos/address.dto";

class AddressController {
  constructor(private addressService: AddressService) {
    this.getAddreses = this.getAddreses.bind(this);
    this.createAddress = this.createAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
  }

  public async getAddreses(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { isSuccess, statusCode, message, data } =
        await this.addressService.getAddressesByUserId(parseInt(userId));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const body = <CreateAddressDto["body"]>req.body;
      const { isSuccess, statusCode, message, data } =
        await this.addressService.createAddress({ userId, ...body });

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId } = req.params;
      const body = <UpdateAddressDto["body"]>req.body;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.addressService.updateAddress(parseInt(addressId), {
          userId,
          ...body,
        });

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }

  public async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId } = req.params;
      const userId = req.userId!;
      const { isSuccess, statusCode, message, data } =
        await this.addressService.deleteAddress(userId, parseInt(addressId));

      return res
        .status(statusCode)
        .json(new HttpResponse(isSuccess, statusCode, message, data));
    } catch (error) {
      next(error);
    }
  }
}

export default new AddressController(addressService);
