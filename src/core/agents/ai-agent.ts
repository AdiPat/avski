import { createOpenAI } from "@ai-sdk/openai";
import { AIAgentOptions } from "@avski/models";
import { LanguageModel } from "ai";

export class AIAgent {
  protected model: LanguageModel;

  constructor(options?: AIAgentOptions) {
    options = options || { llmApiKey: "" };

    try {
      const openai = createOpenAI({ apiKey: options.llmApiKey });
      this.model = openai("gpt-4o-mini");
    } catch (error) {
      console.error("AIAgent: failed to create OpenAI model", error);
      throw new Error("Failed to create OpenAI model.");
    }
  }
}
