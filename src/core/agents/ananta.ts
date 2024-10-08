/**
 *
 * Ananta is an AI-agent that does sentiment analysis.
 *
 */

import { AnantaOptions } from "@avski/models";
import { generateText } from "ai";
import { cleanGPTJson, parseJSON } from "../utils";
import { AIAgent } from "./ai-agent";

export class Ananta extends AIAgent {
  private options: AnantaOptions;

  constructor(options?: AnantaOptions) {
    super(options);
    options = options || { llmApiKey: "" };
    this.options = this.initOptions(options);
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
      ignoreStopwords: options.ignoreStopwords || false,
      customEntities: options.customEntities || [],
      llmApiKey: options.llmApiKey,
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
                Response Schema: { sentiment: string, score: number }
                ${
                  this.options.includeReport
                    ? "Include Report as field 'report' in the JSON. The type of 'report' is string. Write upto 3 paragraphs. "
                    : ""
                }

                ${
                  this.options.includeEmotions
                    ? "Include Emotions as field 'emotions' in the JSON. The type of 'emotions' is object. The object contains the emotions and their scores. "
                    : ""
                }

                ${
                  this.options.customEntities.length > 0
                    ? `Custom Entities: ${this.options.customEntities.join(
                        ","
                      )}`
                    : ""
                }

                ${this.options.ignoreStopwords ? "Ignore Stopwords." : ""}

                ${
                  this.options.context ? `Context: ${this.options.context}` : ""
                }

                ${
                  this.options.language
                    ? `Language: ${this.options.language}`
                    : ""
                }

                ${
                  this.options.sensitivity
                    ? `Sensitivity: ${this.options.sensitivity}`
                    : ""
                }

                ${
                  this.options.threshold
                    ? `Threshold: ${this.options.threshold}`
                    : ""
                }
                `,
        prompt: `Text: "${text}"`,
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
