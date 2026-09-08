import { Router } from "express";
import { UserRole } from "@repo/database";

import { authMiddleware } from "../../middlewares/authMiddleware.ts";
import { requireRole } from "../../middlewares/roleMiddleware.ts";

import { categoryController } from "./controller.ts";

const router: Router = Router();

router.get(
  "/",
  categoryController.getAll,
);

router.get(
  "/:slug",
  categoryController.getBySlug,
);

router.use(authMiddleware);
router.use(requireRole(UserRole.ADMIN));

router.post(
  "/",
  categoryController.create,
);

router.patch(
  "/:categoryId",
  categoryController.update,
);

router.delete(
  "/:categoryId",
  categoryController.delete,
);

export const categoryRoutes = router;