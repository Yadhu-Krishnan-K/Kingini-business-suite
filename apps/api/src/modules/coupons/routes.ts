import { Router } from "express";

import { couponController } from "./controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { validateCouponSchema } from "./validator.ts";

const router: Router = Router();

router.use(authMiddleware);

router.post(
  "/validate",
  (req, res, next) => {
    try {
      req.body = validateCouponSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  couponController.validateCoupon,
);

export default router;