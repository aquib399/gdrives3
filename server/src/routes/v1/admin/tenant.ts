import * as controller from "@/controllers/v1/admins/tenant.js";
import { Router } from "express";

const router = Router();

/*  /api/admin/v1/tenants */
router.get("/", controller.listTenants);
router.get("/:id", controller.getTenant);

export default router;
