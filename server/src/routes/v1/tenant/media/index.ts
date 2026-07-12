import * as validation from "@/validations/v1/tenant/media.js";
import * as controller from "@/controllers/v1/tenants/media.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";
const router = Router();

/* /system/v1/media/health */
router.all("/health", base.healthCheck);

/* /system/v1/media/init */
router.post("/init", validation.initUpload, controller.initUpload);

/* /system/v1/media/complete */
router.post("/complete", validation.completeUpload, controller.completeUpload);

export default router;
