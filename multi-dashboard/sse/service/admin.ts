import { AdminSse } from "../repo/admin";
import { BaseSseService } from "./base";
import { SseData } from "@/types/sse";

interface HeartbeatData {
  id: string;
  role: "admin";
  connectionId: string;
}
interface HandlerEventData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSseCallbacks {
  onHeartbeat: (data: HeartbeatData) => void;
  onHandlerEvent: (data: HandlerEventData) => void;
  onUnknown: (data: SseData<unknown>["response"]) => void;
}

export class AdminSseService extends BaseSseService<AdminSseCallbacks> {
  constructor(
    onUpdate: (data: any) => void,
    onConnectionChange?: (
      isConnected: boolean,
      connectionId: string | null
    ) => void
  ) {
    super(AdminSse.getInstance(), onUpdate, onConnectionChange);
  }

  protected handleEvent(payload: SseData<any>): void {
    switch (payload.response.type) {
      case "heartbeat":
        this.callbacks?.onHeartbeat(payload.response.data);
        break;

      case "handler-event":
        this.callbacks?.onHandlerEvent(payload.response.data);
        break;

      default:
        this.callbacks?.onUnknown(payload.response);
        console.warn("Unhandled Admin SSE Type:", payload.response.type);
        break;
    }

    this.onUpdate(payload);
  }
}
