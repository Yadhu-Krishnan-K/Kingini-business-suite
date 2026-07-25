import { Router } from "express";

import { authRouter } from "../modules/auth/index.ts";

const router: Router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

router.use("/auth", authRouter);

export default router;