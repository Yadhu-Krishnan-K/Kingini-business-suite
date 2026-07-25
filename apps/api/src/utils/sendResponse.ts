import { type Response } from "express";

interface SendResponseOptions<T> {
  statusCode?: number;
  message: string;
  data?: T;
}

export function sendResponse<T>(
  res: Response,
  {
    statusCode = 200,
    message,
    data,
  }: SendResponseOptions<T>
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}