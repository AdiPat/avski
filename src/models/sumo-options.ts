import { AIAgentOptions } from "./ai-agent-options";

interface SumoOptions extends AIAgentOptions {
  rollingSummary?: boolean;
  compression?: boolean;
}

export type { SumoOptions };
