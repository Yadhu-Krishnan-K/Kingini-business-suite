import { Router } from "express";

import { orderController } from "./controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { createOrderSchema } from "./dto.ts";

const router: Router = Router();

router.use(authMiddleware);

router.post(
  "/",
  (req, res, next) => {
    try {
      req.body = createOrderSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  orderController.createOrder,
);
router.get("/", orderController.getMyOrders);
router.get("/:orderId", orderController.getOrderDetails);

export default router;