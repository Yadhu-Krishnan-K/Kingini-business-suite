import { type NextFunction, type Request, type Response } from "express";

import { authService } from "./service.ts";
import {
  registerUserSchema,
  loginSchema
} from "./validator.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerUserSchema.parse(req.body);

      const user = await authService.register(data);

      return sendResponse(res, {
        statusCode: 201,
        message: "User registered successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);

      const result = await authService.login(data);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return sendResponse(res, {
        statusCode: 200,
        message: "Login successful.",
        data: {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();