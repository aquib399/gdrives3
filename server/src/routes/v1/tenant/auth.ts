import * as validation from "@/validations/v1/tenant/auth.js";
import * as controller from "@/controllers/v1/tenants/auth.js";
import { otpRequestLimiter } from "@/middlewares/limiter.js";
import * as base from "@/controllers/index.js";
import { Router } from "express";

const router = Router();

/*  /api/business/v1/auth/health */
router.all("/health", base.healthCheck);
/*  /api/business/v1/auth/signin */
router.post("/signin", validation.signIn, controller.signIn);
/*  /api/business/v1/auth/signup/send-otp */
router.post(
  "/signup/send-otp",
  otpRequestLimiter,
  validation.sendSignupOtp,
  controller.sendSignupOtp
);
/*  /api/business/v1/auth/signup */
router.post("/signup", validation.signUp, controller.signUp);
/*  /api/business/v1/auth/signout */
router.post("/signout", controller.signOut);

export default router;
