/**
 *
 * Ananta is an AI-agent that does sentiment analysis.
 *
 */

import { openai } from "@ai-sdk/openai";
import { AnantaOptions } from "@avski/models";
import { generateText, LanguageModel } from "ai";
import { cleanGPTJson, parseJSON } from "./utils";

export class Ananta {
  private options: AnantaOptions;
  private model: LanguageModel;

  constructor(options?: AnantaOptions) {
    options = options || {};
    this.options = this.initOptions(options);
    this.model = openai("gpt-4o-mini");
  }

  /**
   * Initialize default options.
   * @param options The options to initialize.
   */
  initOptions(options: AnantaOptions): AnantaOptions {
    return {
      sensitivity: options.sensitivity || 0.5,
      language: options.language || "en",
      threshold: options.threshold || 0.5,
      context: options.context || "",
      includeEmotions: options.includeEmotions || false,
      includeReport: options.includeReport || false,
      includeRawProbability: options.includeRawProbability || false,
      ignoreStopwords: options.ignoreStopwords || false,
      customEntities: options.customEntities || [],
    };
  }

  /**
   * Analyze the sentiment of a text.
   *
   * @param text The text to analyze.
   * @returns The sentiment of the text.
   */
  async analyze(
    text: string
  ): Promise<{ sentiment?: string; score?: number; error?: string }> {
    try {
      const { text: response } = await generateText({
        model: this.model,
        system: `You are Ananta, an AI-agent that performs sentiment analysis. 
                I will give you a text and some configuration options.
                Return the response based on the sentiment of the text in JSON format. 
                Response Schema: { sentiment: string, score: number }`,
        prompt: `Text: "${text}"
                 Options: ${JSON.stringify(this.options)}`,
      });

      const responseClean = cleanGPTJson(response);
      const result = parseJSON(responseClean);
      return result;
    } catch (error) {
      console.error("analyze: failed to analyze text", error);
      return {
        error: "Failed to analyze text",
      };
    }
  }
}
