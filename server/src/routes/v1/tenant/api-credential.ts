import { authenticateTenant } from "@/middlewares/authenticate/tenant.js";
import * as controller from "@/controllers/v1/tenants/api-credential.js";
import * as validation from "@/validations/v1/tenant/api-credential.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";

const router = Router();

/*  /api/tenant/v1/api-credentials/health */
router.all("/health", base.healthCheck);

router.use(authenticateTenant);

router.get("/", controller.listApiCredentials);
router.post(
  "/",
  validation.createApiCredential,
  controller.createApiCredential
);
router.get("/:id", controller.getApiCredential);
router.put(
  "/:id",
  validation.updateApiCredential,
  controller.updateApiCredential
);
router.delete("/:id", controller.deleteApiCredential);

export default router;
