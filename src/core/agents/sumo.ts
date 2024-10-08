/**
 *
 * Sumo is an AI-agent that summarizes text.
 *
 */
import { createOpenAI } from "@ai-sdk/openai";
import { SumoOptions } from "@avski/models";
import { compressText, summarize } from "../utils";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { AIAgent } from "./ai-agent";

export class Sumo extends AIAgent {
  private options: SumoOptions;

  constructor(options?: SumoOptions) {
    super(options);
    this.options = this.initOptions(options);

    try {
      createOpenAI({ apiKey: options.llmApiKey });
    } catch (error) {
      console.error("Sumo: failed to create OpenAI model", error);
      throw new Error("Failed to create OpenAI model.");
    }
  }

  /**
   *  Initialize default options.
   * @param options The options to initialize.
   * @returns The initialized options.
   *
   **/
  initOptions(options: SumoOptions): SumoOptions {
    return {
      rollingSummary: options.rollingSummary || false,
      llmApiKey: options.llmApiKey,
      compression: options.compression || false,
    };
  }

  /**
   * Summarize content.
   *
   * @param content The content to summarize.
   * @returns The summary of the content or an error message if summarization fails.
   *
   */
  async summarize(
    content: string
  ): Promise<{ summary?: string; error?: string }> {
    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
      });
      const contentChunks = await splitter.createDocuments([content]);

      let summary = "";

      if (this.options.rollingSummary) {
        let runningSummary = "";

        for (const chunk of contentChunks) {
          const summary = await summarize(
            `${runningSummary} \n ${chunk.pageContent}`,
            this.model
          );
          runningSummary += summary;
        }

        summary = runningSummary;
      } else {
        summary = (
          await Promise.all(
            contentChunks.map((chunk) => summarize(chunk.pageContent))
          )
        ).join("\n");
      }

      if (this.options.compression) {
        const compressedSummary = await compressText(summary, 0.5);

        if (compressedSummary) {
          summary = compressedSummary;
        }
      }

      return { summary };
    } catch (error) {
      console.error("summarize: failed to summarize content", error);
      return {
        error: "Failed to summarize content",
      };
    }
  }
}
