import { Router } from "express";
import { health } from "./controller.ts";

const router: Router = Router();

router.get("/health", health);

export default router;