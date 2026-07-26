import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.ts";
import { authRepository } from "./repository.ts";
import type { RegisterUserDto, RegisteredUserDto } from "./dto.ts";

class AuthService {
  async register(data: RegisterUserDto): Promise<RegisteredUserDto> {
    const existingUser = await authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(409,"Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await authRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export const authService = new AuthService();