import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.ts";
import type { UserRole } from "@repo/database";

export const requireRole = (role: UserRole) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required."));
    }

    if (req.user.role !== role) {
      return next(new AppError(403, "Access denied."));
    }

    next();
  };
};