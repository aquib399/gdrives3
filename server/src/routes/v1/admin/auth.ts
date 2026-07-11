import * as validation from "@/validations/v1/admin/auth.js";
import * as controller from "@/controllers/v1/admins/auth.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";

const router = Router();

/*  /api/admin/v1/auth/health */
router.all("/health", base.healthCheck);

/*  /api/admin/v1/auth/signin */
router.post("/signin", validation.signIn, controller.signIn);
/*  /api/admin/v1/auth/signup */
router.post("/signup", validation.signUp, controller.signUp);
/*  /api/admin/v1/auth/signout */
router.post("/signout", controller.signOut);

export default router;
