import { DEFAULT_HEARTBEAT_INTERVAL_MS } from "@/lib/constant.js";
import { SseClient, sseManager } from "@/utils/sse-manager.js";
import { SseData } from "@/types/sse.js";
import { Role } from "@/types/role.js";
import crypto from "crypto";

export async function sseMiddleware(req: routerRequest, res: routerResponse) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const role = res.locals.role as Role;
  const id = res.locals.id as string;
  const connectionId = crypto.randomUUID();

  const client: SseClient = { res, role, id, connectionId };
  sseManager.addClient(client);

  const initPayload: SseData<any> = {
    timestamp: new Date(),
    response: {
      type: "init",
      data: { connectionId }
    }
  };
  res.write(`data: ${JSON.stringify(initPayload)}\n\n`);

  console.log(`Client connected: ${role}:${id}, connectionId: ${connectionId}`);

  const interval = setInterval(() => {
    const obj: SseData<any> = {
      timestamp: new Date(),
      response: {
        type: "heartbeat",
        data: { id: id, role, connectionId }
      }
    };
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  }, DEFAULT_HEARTBEAT_INTERVAL_MS);

  req.on("close", () => {
    clearInterval(interval);
    sseManager.removeClient(client);
  });
  res.locals.connectionId = connectionId;
}
