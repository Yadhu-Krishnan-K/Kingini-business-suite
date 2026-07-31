import { prisma } from "@repo/database";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "./dto.ts";

class AddressRepository {
  async create(userId: string, data: CreateAddressDto) {
    return prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });
  }

  async findById(id: string) {
    return prisma.address.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAddressDto) {
    return prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.address.delete({
      where: { id },
    });
  }

  async clearDefault(userId: string) {
    return prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }
}

export const addressRepository = new AddressRepository();