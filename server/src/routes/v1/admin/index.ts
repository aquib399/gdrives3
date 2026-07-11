import { authenticateAdmin } from "@/middlewares/authenticate/admin.js";
import * as controller from "@/controllers/v1/admins/index.js";
import * as validation from "@/validations/v1/admin/index.js";
import authRouter from "@/routes/v1/admin/auth.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";

const router = Router();

/*  /api/admin/v1/health */
router.all("/health", base.healthCheck);
/*  /api/admin/v1/auth/* */
router.use("/auth", authRouter);

router.use(authenticateAdmin);
/*  /api/admin/v1/verify-token */
router.post("/verify-token", base.verifyToken);
/*  /api/admin/v1/profile */
router.get("/profile", controller.getProfile);
/*  /api/admin/v1/profile */
router.put("/profile", validation.updateProfile, controller.updateProfile);

import tenantRouter from "./tenant.js";
/*  /api/admin/v1/tenant/* */
router.use("/tenant", tenantRouter);

import sseRouter from "./sse.js";
/*  /api/admin/v1/sse/* */
router.use("/sse", sseRouter);

export default router;
