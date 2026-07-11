import * as base from "@/controllers/index.js";
import { Router } from "express";
import v1 from "./v1.js";
import v2 from "./v2.js";

const router = Router();
router.all("/health", base.healthCheck);
router.use(v1, v2);

export default router;
