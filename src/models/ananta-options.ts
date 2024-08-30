import { AIAgentOptions } from "./ai-agent-options";

interface AnantaOptions extends AIAgentOptions {
  sensitivity?: number;
  language?: string;
  threshold?: number;
  context?: string;
  includeEmotions?: boolean;
  includeReport?: boolean;
  ignoreStopwords?: boolean;
  customEntities?: string[];
}

export type { AnantaOptions };
