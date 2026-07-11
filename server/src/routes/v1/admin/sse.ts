import { sseMiddleware } from "@/middlewares/sse.js";
import { Router } from "express";
const router = Router();

router.use(sseMiddleware);

export default router;
