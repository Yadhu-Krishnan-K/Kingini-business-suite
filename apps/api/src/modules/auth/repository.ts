import { prisma } from "@repo/database";
import type { Prisma } from "@repo/database";

type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
    });
    
  }
}

export const authRepository = new AuthRepository(); 