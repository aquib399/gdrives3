import { SseData } from "@/types/sse.js";
import { Role } from "@/types/role.js";
import { Response } from "express";

export interface SseClient {
  res: Response;
  role: Role;
  id: string;
  connectionId: string;
}

class SseManager {
  private clients: Set<SseClient> = new Set();

  addClient(client: SseClient) {
    this.clients.add(client);
  }

  removeClient(client: SseClient) {
    this.clients.delete(client);
  }

  private send<T>(client: SseClient, type: string, data: T) {
    const payload: SseData<T> = {
      timestamp: new Date(),
      response: { type, data }
    };
    client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }

  broadcastToRole(role: Role, type: string, data: any) {
    this.clients.forEach((client) => {
      if (client.role === role) this.send(client, type, data);
    });
  }

  broadcastToUser(id: string, type: string, data: any) {
    this.clients.forEach((client) => {
      if (client.id === id) this.send(client, type, data);
    });
  }

  broadcastToConnection(connectionId: string, type: string, data: any) {
    this.clients.forEach((client) => {
      if (client.connectionId === connectionId) this.send(client, type, data);
    });
  }

  broadcastToUserExcept(
    userId: string,
    excludeConnectionId: string,
    type: string,
    data: any
  ) {
    this.clients.forEach((client) => {
      if (client.id === userId && client.connectionId !== excludeConnectionId) {
        this.send(client, type, data);
      }
    });
  }
}

export const sseManager = new SseManager();
