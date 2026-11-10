import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../utils/sendResponse.ts";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    cancelRazorpayPayment,
} from "./service.ts";
class PaymentController {
    async createRazorpayOrder(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = await createRazorpayOrder(
                req.user!.userId,
                req.body,
            );

            return sendResponse(res, {
                statusCode: 201,
                message: "Razorpay order created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyRazorpayPayment(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = await verifyRazorpayPayment(
                req.user!.userId,
                req.body,
            );

            return sendResponse(res, {
                statusCode: 200,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelRazorpayPayment(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = await cancelRazorpayPayment(
                req.user!.userId,
                req.body,
            );

            return sendResponse(res, {
                statusCode: 200,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const paymentController = new PaymentController();