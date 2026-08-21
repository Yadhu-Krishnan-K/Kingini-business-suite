import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.ts";
import { authRepository } from "./repository.ts";
import type {
  RegisterUserDto,
  RegisteredUserDto,
  LoginDto,
  LoginResponseDto
} from "./dto.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt.ts";
import { toUserResponse } from "./mapper.ts";

class AuthService {
  async register(data: RegisterUserDto): Promise<RegisteredUserDto> {
    const existingUser = await authRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new AppError(409, "Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await authRepository.create({
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }


  async login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError(401, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password.");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = verifyRefreshToken(refreshToken);

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new AppError(401, "Invalid refresh token.");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return accessToken;
  }

  async me(userId: string): Promise<RegisteredUserDto> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return toUserResponse(user);
  }
}

export const authService = new AuthService();