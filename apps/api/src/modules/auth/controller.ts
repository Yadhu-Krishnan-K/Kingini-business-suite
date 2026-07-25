import { type Request, type Response } from "express";
import { getHealthMessage } from "./service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

export const health = (_req: Request, res: Response) => {
  const message = getHealthMessage();

  // res.status(200).json({
  //   success: true,
  //   message,
  // });

  return sendResponse(res, {
    message,
    data: null,
  });

};