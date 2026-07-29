import { prisma } from "@repo/database";
// import type { Prisma } from "@repo/database";

type CreateUserData = {
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
};

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
    });

  }
}

export const authRepository = new AuthRepository(); 