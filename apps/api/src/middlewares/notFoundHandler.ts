import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../utils/AppError.ts";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
}