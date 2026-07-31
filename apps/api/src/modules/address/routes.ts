import { Router } from "express";

import { addressController } from "./controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";


const router:Router = Router();

router.use(authMiddleware);

router.post("/", addressController.create);
router.get("/", addressController.getAll);
router.patch("/:id", addressController.update);
router.delete("/:id", addressController.delete);

export default router;