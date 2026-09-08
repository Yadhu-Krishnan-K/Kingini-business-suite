import { Router } from "express";
import { UserRole } from "@repo/database";

import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { requireRole } from "../../middlewares/roleMiddleware.ts";
import { upload } from "../../middlewares/uploadMiddleware.ts";

import { productController } from "./controller.ts";

const router: Router = Router();

router.get(
  "/",
  productController.getAll,
);

router.get(
  "/:slug",
  productController.getBySlug,
);

router.use(authMiddleware);
router.use(requireRole(UserRole.ADMIN));

router.post(
  "/",
  productController.create,
);

router.patch(
  "/:productId",
  productController.update,
);

router.delete(
  "/:productId",
  productController.delete,
);

router.post(
  "/:productId/variants",
  productController.createVariant,
);

router.patch(
  "/:productId/variants/:variantId",
  productController.updateVariant,
);

router.patch(
  "/:productId/variants/:variantId/stock",
  productController.updateVariantStock,
);

router.patch(
  "/:productId/variants/:variantId/stock/decrement",
  productController.decrementVariantStock,
);

router.delete(
  "/:productId/variants/:variantId",
  productController.deleteVariant,
);

router.post(
  "/:productId/images",
  upload.single("image"),
  productController.uploadImage,
);

export default router;