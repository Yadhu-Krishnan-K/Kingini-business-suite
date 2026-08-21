import { Router } from "express";

import { authRoutes } from "../modules/auth/index.ts";
import { addressRoutes } from "../modules/address/index.ts";
import { productRoutes } from "../modules/products/index.ts";

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

export default router;