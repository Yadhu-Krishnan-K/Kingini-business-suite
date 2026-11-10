import { Router } from "express";

import { wishlistController } from "./controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { wishlistItemSchema } from "./validator.ts";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", wishlistController.getWishlist);

router.post(
  "/items",
  (req, res, next) => {
    try {
      req.body = wishlistItemSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  wishlistController.addItem,
);

router.delete(
  "/items/:productId",
  wishlistController.removeItem,
);

router.delete(
  "/",
  wishlistController.clearWishlist,
);

export default router;