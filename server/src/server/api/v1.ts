import systemRoutes from "@/routes/v1/system/index.js";
import tenantRouter from "@/routes/v1/tenant/index.js";
import adminsRouter from "@/routes/v1/admin/index.js";
import * as base from "@/controllers/index.js";
import { Role } from "@/types/role.js";
import { Router } from "express";

const router = Router();

router.all("/health", base.healthCheck);

router.use(`/${Role.Admin}/v1`, adminsRouter);
router.use(`/${Role.Tenant}/v1`, tenantRouter);
router.use(`/system/v1`, systemRoutes);

export default router;
