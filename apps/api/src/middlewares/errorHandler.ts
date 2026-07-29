import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../utils/AppError.ts";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.JsonWebTokenError
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}