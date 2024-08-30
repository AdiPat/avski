/**
 *
 * Shesha is an AI-agent that does PoS tagging, entity recognition, and text classification.
 *
 */

import { SheshaOptions } from "@avski/models";
import { AIAgent } from "./ai-agent";
import { generateText } from "ai";
import { cleanGPTJson, parseJSON } from "../utils";

export class Shesha extends AIAgent {
  private options: SheshaOptions;

  constructor(options?: SheshaOptions) {
    super(options);
    this.options = this.initOptions(options);
  }

  /**
   *  Initialize default options.
   * @param options The options to initialize.
   * @returns The initialized options.
   *
   **/
  initOptions(options: SheshaOptions): SheshaOptions {
    return {
      llmApiKey: options.llmApiKey,
      domain: options.domain || "general",
      tasks: options.tasks || ["all"],
      customEntities: options.customEntities || [],
      customStopwords: options.customStopwords || [],
    };
  }

  /**
   * Perform PoS tagging, entity recognition, or text classification.
   *
   * @param text The text to analyze.
   * @returns The result of the analysis.
   *
   */
  async analyze(text: string): Promise<{ result?: string; error?: string }> {
    try {
      const { text: response } = await generateText({
        model: this.model,
        system: `You are Shesha, an AI-agent that performs PoS tagging, entity recognition, and text classification. 
                    I will give you a text and some configuration options.
                    Return the response based on the analysis of the text in JSON format. 

                    ${
                      this.options.tasks.includes("pos-tagging") ||
                      this.options.tasks.includes("all")
                        ? "Perform PoS tagging. Include the response in result under the 'pos' field. "
                        : ""
                    }

                    ${
                      this.options.tasks.includes("entity-recognition") ||
                      this.options.tasks.includes("all")
                        ? "Perform entity recognition. Include the response in result under the 'entities' field. "
                        : ""
                    }

                    ${
                      this.options.tasks.includes("text-classification") ||
                      this.options.tasks.includes("all")
                        ? "Perform text classification. Include the response in result under the 'classification' field. "
                        : ""
                    }
                    Response Schema: { result: { pos-tagging, entity_recognition, text-classification } }`,
        prompt: `Text: "${text}"`,
      });

      const responseJson = cleanGPTJson(response);

      const result = parseJSON(responseJson);

      if (!result) {
        return {
          error: "Failed to analyze text (JSON parse error).",
        };
      }

      return {
        result: result.result,
      };
    } catch (err) {
      console.error("analyze: failed to analyze text", err);
      return { error: "Failed to analyze text." };
    }
  }
}
