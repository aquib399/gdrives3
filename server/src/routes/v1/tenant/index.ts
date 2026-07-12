import { authenticateTenant } from "@/middlewares/authenticate/tenant.js";
import apiCredentialRouter from "@/routes/v1/tenant/api-credential.js";
import * as controller from "@/controllers/v1/tenants/index.js";
import * as validation from "@/validations/v1/tenant/index.js";
import mediaRouter from "@/routes/v1/tenant/media/index.js";
import googleRouter from "@/routes/v1/tenant/google.js";
import authRouter from "@/routes/v1/tenant/auth.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";

const router = Router();

// /api/tenant/v1/health
router.all("/health", base.healthCheck);

// /api/tenant/v1/auth
router.use("/auth", authRouter);

router.use("/google", googleRouter);

router.use("/api-credentials", apiCredentialRouter);

router.use(authenticateTenant);
//  /api/tenant/v1/verify-token
router.post("/verify-token", base.verifyToken);

// /api/tenant/v1/media
router.use("/media", mediaRouter);

//  /api/tenant/v1/profile
router.get("/profile", controller.getProfile);
//  /api/tenant/v1/profile
router.put("/profile", validation.updateProfile, controller.updateProfile);

export default router;
