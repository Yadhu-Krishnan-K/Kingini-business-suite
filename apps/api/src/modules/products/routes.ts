import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { upload } from "../../middlewares/uploadMiddleware.ts";
import { productController } from "./controller.ts";
import { UserRole } from "@repo/database";
import { requireRole } from "../../middlewares/roleMiddleware.ts";

const router: Router = Router();

router.use(authMiddleware);

router.post(
  "/:productId/images",
  requireRole(UserRole.ADMIN),
  upload.single("image"),
  productController.uploadImage,
);

export default router;