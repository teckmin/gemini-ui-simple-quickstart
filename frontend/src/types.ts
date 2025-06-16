export interface Message {
  id?: string;
  type: "human" | "ai";
  content: string | Record<string, unknown>;
}
