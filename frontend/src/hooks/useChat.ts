import { useState, useCallback } from "react";
import type { Message } from "@/types";

interface Options {
  apiUrl: string;
}

export function useChat(options: Options) {
  const { apiUrl } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(
    async (payload: { messages: Message[] }) => {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload.messages }),
        });
        const data = await res.json();
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: data.response,
        };
        setMessages([...payload.messages, aiMessage]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  const stop = useCallback(() => {
    /* no-op */
  }, []);

  return { messages, isLoading, submit, stop } as const;
}
