import tenantRouter from "@/routes/v1/tenant/index.js";
import adminsRouter from "@/routes/v1/admin/index.js";
import * as base from "@/controllers/index.js";
import { Role } from "@/types/role.js";
import { Router } from "express";

const router = Router();

router.all("/health", base.healthCheck);

router.use(`/${Role.Admin}`, adminsRouter);
router.use(`/${Role.Tenant}`, tenantRouter);

export default router;
