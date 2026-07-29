import { Router } from "express";

import { authController } from "./controller.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);    

router.get("/me", authMiddleware, authController.me);

export default router;