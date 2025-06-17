import { useChat } from "@/hooks/useChat";
import type { Message } from "@/types";
import { useEffect, useRef, useCallback } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";

export default function App() {
  const chat = useChat({
    apiUrl: import.meta.env.DEV ? "http://localhost:2024" : "http://localhost:8123",
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chat.messages]);

  const handleSubmit = useCallback(
    (submittedInputValue: string) => {
      if (!submittedInputValue.trim()) return;
      const newMessages: Message[] = [
        ...(chat.messages || []),
        {
          type: "human",
          content: submittedInputValue,
          id: Date.now().toString(),
        },
      ];
      chat.submit({ messages: newMessages });
    },
    [chat]
  );

  const handleCancel = useCallback(() => {
    chat.stop();
  }, [chat]);

  return (
    <div className="flex h-screen bg-neutral-800 text-neutral-100 font-sans antialiased">
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
        <div className={`flex-1 overflow-y-auto ${chat.messages.length === 0 ? "flex" : ""}`}>
          {chat.messages.length === 0 ? (
            <WelcomeScreen handleSubmit={handleSubmit} isLoading={chat.isLoading} onCancel={handleCancel} />
          ) : (
            <ChatMessagesView
              messages={chat.messages}
              isLoading={chat.isLoading}
              scrollAreaRef={scrollAreaRef}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              liveActivityEvents={[]}
              historicalActivities={{}}
            />
          )}
        </div>
      </main>
    </div>
  );
}
