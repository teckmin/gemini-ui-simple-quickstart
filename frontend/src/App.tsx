import { useStream } from "@/hooks/useStream";
import type { Message } from "@/types";
import { useRef, useCallback, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";

export default function App() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const thread = useStream<{ messages: Message[] }>({
    apiUrl: import.meta.env.DEV ? "http://localhost:2024" : "http://localhost:8123",
    assistantId: "agent",
    messagesKey: "messages",
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        (viewport as HTMLElement).scrollTop = (viewport as HTMLElement).scrollHeight;
      }
    }
  }, [thread.messages]);

  const handleSubmit = useCallback(
    (submittedInputValue: string) => {
      if (!submittedInputValue.trim()) return;
      const newMessages: Message[] = [
        ...(thread.messages || []),
        {
          type: "human",
          content: submittedInputValue,
          id: Date.now().toString(),
        },
      ];
      thread.submit({ messages: newMessages });
    },
    [thread]
  );

  const handleCancel = useCallback(() => {
    thread.stop();
    window.location.reload();
  }, [thread]);

  return (
    <div className="flex h-screen bg-neutral-800 text-neutral-100 font-sans antialiased">
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
        <div className={`flex-1 overflow-y-auto ${thread.messages.length === 0 ? "flex" : ""}`}>
          {thread.messages.length === 0 ? (
            <WelcomeScreen
              handleSubmit={handleSubmit}
              isLoading={thread.isLoading}
              onCancel={handleCancel}
            />
          ) : (
            <ChatMessagesView
              messages={thread.messages}
              isLoading={thread.isLoading}
              scrollAreaRef={scrollAreaRef}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </main>
    </div>
  );
}
