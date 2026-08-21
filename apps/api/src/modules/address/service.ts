import { AppError } from "../../utils/AppError.ts";
import { addressRepository } from "./repository.ts";
import { toAddressResponse } from "./mapper.ts";
import type {
  CreateAddressDto,
  UpdateAddressDto,
  AddressResponseDto,
} from "./dto.ts";

class AddressService {

  async create( userId: string, data: CreateAddressDto,): Promise<AddressResponseDto> {

    if (data.isDefault) {
      await addressRepository.clearDefault(userId);
    }

    const address = await addressRepository.create(userId, data);

    return toAddressResponse(address);
  }

  async getAll(userId: string): Promise<AddressResponseDto[]> {
    const addresses = await addressRepository.findByUserId(userId);

    return addresses.map(toAddressResponse);
  }

  async update(
    userId: string,
    addressId: string,
    data: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = await addressRepository.findById(addressId);

    if (!address || address.userId !== userId) {
      throw new AppError(404, "Address not found.");
    }

    if (data.isDefault) {
      await addressRepository.clearDefault(userId);
    }

    const updated = await addressRepository.update(addressId, data);

    return toAddressResponse(updated);
  }

  async delete(userId: string, addressId: string): Promise<void> {
    const address = await addressRepository.findById(addressId);

    if (!address || address.userId !== userId) {
      throw new AppError(404, "Address not found.");
    }

    await addressRepository.delete(addressId);
  }
}

export const addressService = new AddressService();