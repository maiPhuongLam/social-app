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
import { AddressRepository } from "../repositories/address.repository";

export class AddressService {
  constructor(
    private userRepository: UserReposotory,
    private addressReoisitory: AddressRepository
  ) {}

  public async getAddressesByUserId(userId: number) {
    const addresses = await this.addressReoisitory.getAddresesByUserId(userId);

    return formateData(true, 200, "Get Address success", addresses);
  }

  public async createAddress(input: CreateAddressInput) {
    const address = await this.addressReoisitory.createAddress(input);
    if (!address) {
      return formateData(false, 400, "Create Address fail", null);
    }
    const user = await this.userRepository.findUserById(address?.userId);

    return formateData(true, 200, "Create address success", address);
  }

  public async updateAddress(adddressId: number, input: UpdateAddressInput) {
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

    return formateData(true, 200, "Create address success", updatedAddress);
  }

  public async deleteAddress(userId: number, adddressId: number) {
    const address = await this.addressReoisitory.getAddressById(adddressId);

    if (!address) {
      return formateData(false, 404, "Adress not found", null);
    }

    if (address.userId !== userId) {
      return formateData(false, 401, "Not authorized", null);
    }

    await this.addressReoisitory.deleteAddress(adddressId);

    const user = await this.userRepository.findUserById(address?.userId);

    return formateData(true, 200, "Delete address success", null);
  }
}

const addressService = new AddressService(
  new UserReposotory(),
  new AddressRepository()
);

export default addressService;
