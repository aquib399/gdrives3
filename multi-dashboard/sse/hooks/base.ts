"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { BaseSseService } from "../service/base";

export const useBaseSse = <T, S extends BaseSseService>(
  ServiceClass: new (
    onUpdate: (data: T) => void,
    onConnectionChange: (
      isConnected: boolean,
      connectionId: string | null
    ) => void
  ) => S,
  maxHistory: number = 100
) => {
  const [messages, setMessages] = useState<T[]>([]);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  const messagesRef = useRef<T[]>([]);
  const serviceRef = useRef<S | null>(null);

  // eslint-disable-next-line react-hooks/refs
  if (!serviceRef.current) {
    serviceRef.current = new ServiceClass(
      (newData: T) => {
        setLastMessage(newData);
        setMessages((prev) => {
          const updated = [...prev, newData];
          const trimmed =
            updated.length > maxHistory
              ? updated.slice(updated.length - maxHistory)
              : updated;

          messagesRef.current = trimmed;
          return trimmed;
        });
      },
      (status: boolean, id: string | null) => {
        setIsConnected(status);
        setConnectionId(id);
      }
    );
  }

  const connect = useCallback(() => {
    serviceRef.current?.startListening();
  }, []);

  const disconnect = useCallback(() => {
    serviceRef.current?.stopListening();
  }, []);

  const getAllMessages = useCallback(() => {
    return messagesRef.current;
  }, []);

  const getLastMessage = useCallback(() => {
    const msgs = messagesRef.current;
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
    messagesRef.current = [];
  }, []);

  const registerCallbacks = useCallback(
    (c: Parameters<S["registerCallbacks"]>[0]) => {
      serviceRef.current?.registerCallbacks(c);
    },
    []
  );

  useEffect(() => {
    return () => {
      serviceRef.current?.stopListening();
    };
  }, []);

  return {
    state: {
      messages,
      lastMessage,
      isConnected,
      connectionId
    },
    actions: {
      connect,
      disconnect,
      getAllMessages,
      getLastMessage,
      clearMessages
    },
    registerCallbacks
  };
};
