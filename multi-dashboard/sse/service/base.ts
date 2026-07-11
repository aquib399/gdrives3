import { BaseSse } from "../repo/base";
import { SseData } from "@/types/sse";

export abstract class BaseSseService<TCallbacks = any> {
  protected sseClient: BaseSse;
  protected onUpdate: (data: any) => void;
  protected onConnectionChange?: (
    isConnected: boolean,
    connectionId: string | null
  ) => void;
  protected callbacks: TCallbacks | null = null;

  constructor(
    sseClient: BaseSse,
    onUpdate: (data: any) => void,
    onConnectionChange?: (
      isConnected: boolean,
      connectionId: string | null
    ) => void
  ) {
    this.sseClient = sseClient;
    this.onUpdate = onUpdate;
    this.onConnectionChange = onConnectionChange;
  }

  registerCallbacks(c: TCallbacks): void {
    this.callbacks = c;
  }

  startListening(): void {
    this.sseClient.connect((raw: any) => {
      const payload: SseData<any> = {
        timestamp: new Date(raw.timestamp),
        response: raw.response
      };
      this.handleEvent(payload);
    }, this.onConnectionChange);
  }

  stopListening(): void {
    this.sseClient.disconnect();
  }

  protected abstract handleEvent(payload: SseData<any>): void;
}
