import { type Response } from "express";

interface SendResponseOptions<T> {
  statusCode?: number;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendResponse<T>(
  res: Response,
  {
    statusCode = 200,
    message,
    data,
    pagination,
  }: SendResponseOptions<T>
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
}