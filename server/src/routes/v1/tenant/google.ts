import { authenticateTenant } from "@/middlewares/authenticate/tenant.js";
import * as controller from "@/controllers/v1/tenants/google.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";

const router = Router();

/*  /api/business/v1/google/health */
router.all("/health", base.healthCheck);

/*  /api/business/v1/google/auth/callback */
router.get("/auth/callback", controller.handleCallback);

/*  /api/business/v1/google/auth/getAuthUrl */
router.get("/auth/getAuthUrl", authenticateTenant, controller.getAuthUrl);

export default router;
