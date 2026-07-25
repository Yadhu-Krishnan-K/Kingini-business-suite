import { type Request, type Response } from "express";
import { getHealthMessage } from "./service.ts";

export const health = (_req: Request, res: Response) => {
  const message = getHealthMessage();

  res.status(200).json({
    success: true,
    message,
  });
};