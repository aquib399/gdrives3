import { errorHandler } from "@/middlewares/error-handler.js";
import { app, server } from "@/clients/express-http.js";
import { getDateTime } from "@/middlewares/logger.js";
import { corsConfig } from "@/middlewares/cors.js";
import { IS_PRODUCTION } from "@/lib/constant.js";
import { logger } from "@/middlewares/logger.js";
import { PORT } from "@/configs/env.js";
import apiRouter from "./api/index.js";
import express from "express";
import "@/clients/index.js";

Error.stackTraceLimit = 1;

// app.set("trust proxy", 1);
app.use(corsConfig, express.json({ limit: "5mb" }), logger);
const currentDateTime = getDateTime(new Date());

app.get("/", (_, res) => {
  return res.status(200).json({
    error: false,
    message: "Server running 🚀",
    data: {
      deployedAt: currentDateTime
    }
  });
});

app.use("/api", apiRouter);

app.use(errorHandler);

app.all("/whatsapp/webhook", (req, res) => {
  console.log("Webhook received:", req.body, req.query);
  return res.send(req.query.hub_challenge);
});

app.use((_, res) => {
  return res.status(404).json({
    error: true,
    message: "Route not found"
  });
});

function startServer() {
  server.listen(PORT, () => {
    console.log(
      `\x1b[36m${
        IS_PRODUCTION ? "Production" : "Development"
      } Server listening at \x1b[33mhttp://localhost:${PORT}\x1b[0m`
    );
  });
}

startServer();
