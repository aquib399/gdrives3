import { Role } from "@/types/role.js";
import { Router } from "express";

const router = Router();

router.use(`/${Role.Admin}/v2`, (_, res) =>
  res.json({ version: "v2", role: Role.Admin })
);
router.use(`/${Role.Tenant}/v2`, (_, res) =>
  res.json({ version: "v2", role: Role.Tenant })
);

export default router;
