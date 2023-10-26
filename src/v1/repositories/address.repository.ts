import { CreateAddressInput, UpdateAddressInput } from "../../custom-type";
import { prisma } from "../../index";

export class AddressRepository {
  constructor() {}

  public async createAddress(createAddressInput: CreateAddressInput) {
    if (!createAddressInput.userId) {
      return null;
    }
    return await prisma.address.create({ data: createAddressInput });
  }

  public async updateAddress(
    addressId: number,
    updateAddressInput: UpdateAddressInput
  ) {
    if (!addressId) {
      return null;
    }

    return await prisma.address.update({
      where: { id: addressId },
      data: updateAddressInput,
    });
  }

  public async getAddresesByUserId(userId: number) {
    return await prisma.address.findMany({ where: { userId } });
  }

  public async getAddressById(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.address.findUnique({ where: { id } });
  }

  public async deleteAddress(id: number) {
    if (!id) {
      return null;
    }
    return await prisma.address.delete({
      where: { id },
    });
  }
}
