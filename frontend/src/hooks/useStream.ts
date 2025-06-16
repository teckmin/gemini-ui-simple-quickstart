import { useState, useRef, useCallback } from "react";
import type { Message } from "@/types";

interface Options {
  apiUrl: string;
  assistantId: string;
  messagesKey: string;
  onFinish?: (event: unknown) => void;
  onUpdateEvent?: (event: unknown) => void;
}

export function useStream(options: Options) {
  const { apiUrl, assistantId, messagesKey, onFinish, onUpdateEvent } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const submit = useCallback(async (payload: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/assistants/${assistantId}/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const runId = data.run_id;
      const es = new EventSource(
        `${apiUrl}/assistants/${assistantId}/runs/${runId}/events`
      );
      eventSourceRef.current = es;
      es.onmessage = (ev) => {
        if (ev.data === "[DONE]") {
          setIsLoading(false);
          es.close();
          onFinish?.(ev);
          return;
        }
        const event = JSON.parse(ev.data);
        if (event[messagesKey]) {
          setMessages(event[messagesKey] as Message[]);
        }
        onUpdateEvent?.(event);
      };
      es.onerror = () => {
        es.close();
        setIsLoading(false);
      };
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [apiUrl, assistantId, messagesKey, onFinish, onUpdateEvent]);

  const stop = useCallback(() => {
    eventSourceRef.current?.close();
    setIsLoading(false);
  }, []);

  return { messages, isLoading, submit, stop } as const;
}
