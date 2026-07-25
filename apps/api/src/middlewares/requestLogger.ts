import { type NextFunction, type Request, type Response } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );

  next();
}