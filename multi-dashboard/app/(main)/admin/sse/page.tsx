"use client";

import { Button } from "@/components/ui/button";
import { useAdminSse } from "@/sse/hooks/admin";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SseTestPage() {
  const { state, actions, registerCallbacks } = useAdminSse();

  const handleGetAll = () => {
    const all = actions.getAllMessages();
    console.log("All Messages:", all);
    alert(`Logged ${all.length} messages to console.`);
  };

  const handleGetLast = () => {
    const last = actions.getLastMessage();
    console.log("Last Message:", last);
    alert(
      `Last message type: ${last?.response?.type || "None"}. Check console.`
    );
  };

  useEffect(() => {
    registerCallbacks({
      onHeartbeat: (data) => {
        console.log("Heartbeat received:", data);
        toast.info("Heartbeat received");
      },
      onHandlerEvent: (data) => {
        console.log("Handler event received:", data);
        toast.success("Handler event received");
      },
      onUnknown: (data) => {
        console.warn("Unknown event type received:", data);
        toast.warning("Unknown event type received");
      }
    });
  }, [registerCallbacks]);

  return (
    <div className="text-foreground mx-auto flex h-[calc(100vh-56px)] w-full max-w-7xl flex-col gap-8 p-6">
      {/* Header & Status */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-lg">
            <span className="text-muted-foreground font-semibold">Status:</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                state.isConnected
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {state.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {state.connectionId && (
            <div className="border-border bg-muted text-muted-foreground flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
              <span className="font-semibold">ID:</span>
              <code className="text-foreground font-mono">
                {state.connectionId}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="border-border bg-card flex flex-wrap justify-center gap-3 rounded-xl border p-4 shadow-sm">
        <Button onClick={actions.connect} disabled={state.isConnected}>
          Connect
        </Button>
        <Button
          onClick={actions.disconnect}
          disabled={!state.isConnected}
          variant="destructive"
        >
          Disconnect
        </Button>
        <Button onClick={actions.clearMessages} variant="secondary">
          Clear History
        </Button>
        <Button onClick={handleGetAll} variant="outline">
          Get All (Console)
        </Button>
        <Button onClick={handleGetLast} variant="outline">
          Get Last (Console)
        </Button>
      </div>

      {/* Data Visualization Grid */}
      <div className="grid h-full w-full gap-6 overflow-hidden md:grid-cols-2">
        {/* Live Latest Message */}
        <div className="border-border bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm">
          <div className="border-border bg-muted/50 text-card-foreground border-b p-4 text-sm font-semibold">
            Latest Message Data
          </div>
          <pre className="bg-muted/20 text-foreground flex-1 overflow-auto p-4 font-mono text-sm">
            {state.lastMessage ? (
              JSON.stringify(state.lastMessage, null, 2)
            ) : (
              <span className="text-muted-foreground italic">
                Waiting for data...
              </span>
            )}
          </pre>
        </div>

        {/* Rolling Message History */}
        <div className="border-border bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm">
          <div className="border-border bg-muted/50 text-card-foreground flex items-center justify-between border-b p-4 text-sm font-semibold">
            <span>Message Log</span>
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
              {state.messages.length}
            </span>
          </div>
          <div className="bg-muted/10 flex-1 space-y-3 overflow-auto p-4">
            {[...state.messages].reverse().map((msg, idx) => (
              <div
                key={idx}
                className="border-border bg-background hover:bg-muted/50 flex flex-col gap-2 rounded-lg border p-3 text-sm shadow-sm transition-colors"
              >
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span className="font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-mono">
                    #{state.messages.length - idx}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-primary font-medium">
                    {msg.response.type}
                  </span>
                </div>
              </div>
            ))}
            {state.messages.length === 0 && (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm italic">
                No messages received yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
