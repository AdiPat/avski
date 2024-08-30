import { AIAgentOptions } from "./ai-agent-options";

type SheshaTask =
  | "pos-tagging"
  | "entity-recognition"
  | "text-classification"
  | "all";

interface SheshaOptions extends AIAgentOptions {
  domain?: string;
  tasks: SheshaTask[];
  customEntities?: string[];
  customStopwords?: string[];
}

export type { SheshaOptions };
