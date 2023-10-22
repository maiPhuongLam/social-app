import {
  CreateAddressInput,
  UpdateAddressInput,
  UpdateUserInput,
} from "../../custom-type";
import { UserReposotory } from "../repositories/user.repository";
import { formateData } from "../../utils/formate-data";
import cloudinary from "cloudinary";
import { unlinkSync } from "fs";
import config from "../../config";
import { CacheService } from "./cache.service";
import { AddressRepository } from "../repositories/address.repository";

export class AddressService {
  constructor(
    private userRepository: UserReposotory,
    private addressReoisitory: AddressRepository,
    private cacheService: CacheService
  ) {
    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.api_key,
      api_secret: config.cloudinary.api_secret,
      secure: true,
    });
  }

  async getAddressesByUserId(userId: number) {
    const addresses = await this.addressReoisitory.getAddresesByUserId(userId);

    return formateData(true, 200, "Get Address success", addresses);
  }

  async createAddress(input: CreateAddressInput) {
    const address = await this.addressReoisitory.createAddress(input);
    if (!address) {
      return formateData(false, 400, "Create Address fail", null);
    }
    const user = await this.userRepository.findUserById(address?.userId);
    this.cacheService.setData(`profiles:${address.userId}`, 3600, user);

    return formateData(true, 200, "Create address success", address);
  }

  async updateAddress(adddressId: number, input: UpdateAddressInput) {
    const address = await this.addressReoisitory.getAddressById(adddressId);

    if (!address) {
      return formateData(false, 404, "Adress not found", null);
    }

    if (address.userId !== input.userId) {
      return formateData(false, 401, "Not authorized", null);
    }

    const updatedAddress = await this.addressReoisitory.updateAddress(
      adddressId,
      input
    );
    const user = await this.userRepository.findUserById(address?.userId);
    this.cacheService.setData(`profiles:${address.userId}`, 3600, user);

    return formateData(true, 200, "Create address success", updatedAddress);
  }

  async deleteAddress(userId: number, adddressId: number) {
    const address = await this.addressReoisitory.getAddressById(adddressId);

    if (!address) {
      return formateData(false, 404, "Adress not found", null);
    }

    if (address.userId !== userId) {
      return formateData(false, 401, "Not authorized", null);
    }

    await this.addressReoisitory.deleteAddress(adddressId);

    const user = await this.userRepository.findUserById(address?.userId);
    this.cacheService.setData(`profiles:${address.userId}`, 3600, user);

    return formateData(true, 200, "Delete address success", null);
  }
}
