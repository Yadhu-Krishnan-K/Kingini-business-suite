import { Router } from "express";

import { cartController } from "./controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import {
  addCartItemSchema,
  updateCartItemSchema,
} from "./validator.ts";

const router:Router = Router();

router.use(authMiddleware);

router.get("/", cartController.getCart);

router.post(
  "/items",
  (req, res, next) => {
    try {
      req.body = addCartItemSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  cartController.addItem,
);

router.patch(
  "/items",
  (req, res, next) => {
    try {
      req.body = updateCartItemSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  cartController.updateItem,
);

router.delete(
  "/items/:variantId",
  cartController.removeItem,
);

router.delete(
  "/",
  cartController.clearCart,
);

export default router;