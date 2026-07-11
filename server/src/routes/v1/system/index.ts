import mediaRouter from "./media/index.js";
import { Router } from "express";

const router = Router();

/* /system/v1/media */
router.use("/media", mediaRouter);

export default router;
