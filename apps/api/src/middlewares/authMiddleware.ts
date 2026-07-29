import { type NextFunction, type Request, type Response } from "express";

import { AppError } from "../utils/AppError.ts";
import { verifyAccessToken } from "../utils/jwt.ts";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError(401, "Authentication required.");
    }

    const payload = verifyAccessToken(accessToken);

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}