import { Router } from "express";

import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import {
  createRazorpayOrderSchema,
  verifyRazorpayPaymentSchema,
  cancelRazorpayPaymentSchema,
} from "./dto.ts";
import { paymentController } from "./controller.ts";

const router: Router = Router();

router.use(authMiddleware);

router.post(
  "/razorpay/order",
  (req, res, next) => {
    try {
      req.body = createRazorpayOrderSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.createRazorpayOrder,
);

router.post(
  "/razorpay/verify",
  (req, res, next) => {
    try {
      req.body = verifyRazorpayPaymentSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.verifyRazorpayPayment,
);

router.post(
  "/razorpay/cancel",
  (req, res, next) => {
    try {
      req.body = cancelRazorpayPaymentSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.cancelRazorpayPayment,
);

export default router;