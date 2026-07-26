import { type NextFunction, type Request, type Response } from "express";

import { authService } from "./service.ts";
import { registerUserSchema } from "./validator.ts";
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
}

export const authController = new AuthController();