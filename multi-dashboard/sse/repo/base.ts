import { API_BASE_URL } from "@/lib/constant";

export abstract class BaseSse {
  protected eventSource: EventSource | null = null;
  protected baseUrl: string;
  protected endpoint: string;
  protected isConnected: boolean = false;
  public connectionId: string | null = null;

  protected onConnectionChange?: (
    isConnected: boolean,
    connectionId: string | null
  ) => void;

  constructor(p: { baseUrl?: string; endpoint: string }) {
    this.baseUrl = p.baseUrl || API_BASE_URL!;
    this.endpoint = p.endpoint;
  }

  connect(
    onMessage: (data: any) => void,
    onConnectionChange?: (
      isConnected: boolean,
      connectionId: string | null
    ) => void
  ): void {
    if (this.eventSource) return;

    this.onConnectionChange = onConnectionChange;
    this.eventSource = new EventSource(`${this.baseUrl}${this.endpoint}`, {
      withCredentials: true
    });

    this.eventSource.onopen = () => {
      this.isConnected = true;
      this.onConnectionChange?.(true, this.connectionId);
    };

    this.eventSource.onerror = () => {
      this.isConnected = false;
      this.connectionId = null;
      this.onConnectionChange?.(false, null);
    };

    this.eventSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed?.response?.type === "init") {
        this.connectionId = parsed.response.data.connectionId;
        this.onConnectionChange?.(true, this.connectionId);
        return;
      }

      onMessage(parsed);
    };
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    this.connectionId = null;
    this.onConnectionChange?.(false, null);
  }
}
