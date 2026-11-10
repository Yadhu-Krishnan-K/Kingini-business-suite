import { Router } from "express";

import { authRoutes } from "../modules/auth/index.ts";
import { addressRoutes } from "../modules/address/index.ts";
import { productRoutes } from "../modules/products/index.ts";
import { categoryRoutes } from "../modules/categories/index.ts";
import { cartRoutes } from "../modules/cart/index.ts";
import { wishlistRoutes } from "../modules/wishlist/index.ts";
import { couponRoutes } from "../modules/coupons/index.ts";
import { orderRoutes } from "../modules/orders/index.ts";
import { paymentRoutes } from "../modules/payments/index.ts";

const router: Router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/addresses", addressRoutes);
router.use("/products", productRoutes); 
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

export default router;