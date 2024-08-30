import { AIAgentOptions } from "./ai-agent-options";

type Formality = "formal" | "informal" | "neutral";

type Tone = "friendly" | "professional" | "serious";

interface VasukhiOptions extends AIAgentOptions {
  targetLanguage?: string;
  domain?: string;
  formality?: Formality;
  tone?: Tone;
  preserveFormatting?: boolean;
  customGlossary?: string[];
  customStopwords?: string[];
}

export type { VasukhiOptions };
