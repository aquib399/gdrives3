"use client";

export interface IEventSourceClient {
  registerOnMessageCallback(callback: (data: any) => void): void;
  close(): void;
  connect(url: string): void;
  disconnect(): void;
  isConnected(): boolean;
}

export class EventSourceClient implements IEventSourceClient {
  private onMessageCallback?: (data: any) => void;

  private sse?: EventSource;
  private connected = false;

  constructor() {}

  registerOnMessageCallback(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }

  async connect(url: string): Promise<boolean> {
    if (this.sse) return this.connected;

    if (typeof window === "undefined") return false;

    this.sse = new EventSource(url, {
      withCredentials: true
    });

    this.initialize();

    return new Promise<boolean>((resolve) => {
      if (this.sse) {
        this.sse.onopen = () => {
          this.connected = true;
          resolve(true);
        };
        this.sse.onerror = () => {
          this.connected = false;
          resolve(false);
        };
      }
    });
  }

  initialize() {
    if (this.sse) {
      this.sse.onmessage = (event: any) => {
        this.onMessageCallback?.(event.data);
      };

      this.sse.onopen = () => {
        this.connected = true;
        // do something
      };

      this.sse.onerror = () => {
        this.connected = false;
      };
    }
  }

  close(): void {
    this.disconnect();
  }

  disconnect(): void {
    if (!this.sse) return;

    this.sse.close();
    this.sse = undefined;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
