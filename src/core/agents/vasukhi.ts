import { VasukhiOptions } from "@avski/models";
import { AIAgent } from "./ai-agent";
import { generateText } from "ai";
import { cleanGPTJson, parseJSON } from "../utils";

export class Vasukhi extends AIAgent {
  private options: VasukhiOptions;

  constructor(options?: VasukhiOptions) {
    super(options);
    options = options || { llmApiKey: "" };
    this.options = this.initOptions(options);
  }

  initOptions(options: VasukhiOptions): VasukhiOptions {
    return {
      targetLanguage: options.targetLanguage || "en",
      domain: options.domain || "general",
      formality: options.formality || "neutral",
      tone: options.tone || "friendly",
      preserveFormatting: options.preserveFormatting || false,
      customGlossary: options.customGlossary || [],
      customStopwords: options.customStopwords || [],
    };
  }

  async detectLanguage(
    text: string
  ): Promise<{ detectedLanguage?: string; error?: string }> {
    try {
      const { text: response } = await generateText({
        model: this.model,
        system: `You are Vasukhi, an AI-agent that detects the language of a text. 
                      I will give you a text. Return the detected language of the text in JSON format. 
                      Response Schema: { detectedLanguage: string }`,
        prompt: `Text: "${text}"`,
      });

      const responseJson = cleanGPTJson(response);

      const result = parseJSON(responseJson);

      if (!result) {
        return {
          error: "Failed to detect language (JSON parse error).",
        };
      }

      return {
        detectedLanguage: result.detectedLanguage,
      };
    } catch (error) {
      console.error("detectLanguage: failed to detect language", error);
      return { error: "Failed to detect language." };
    }
  }

  async translate(text: string): Promise<{
    translatedText?: string;
    detectedLanguage?: string;
    error?: string;
  }> {
    try {
      const { text: response } = await generateText({
        model: this.model,
        system: `You are Vasukhi, an AI-agent that translates text. 
                        I will give you a text. Return the translated text in JSON format. 
                        Response Schema: { translatedText: string, detectedLanguage: string }.
                        
                        ${
                          this.options.customGlossary &&
                          this.options.customGlossary.length > 0
                            ? `Custom Glossary: ${this.options.customGlossary.join(
                                ","
                              )}`
                            : ""
                        }
                            
                        ${
                          this.options.customStopwords &&
                          this.options.customStopwords.length > 0
                            ? `Ignore Stopwords. ${this.options.customStopwords.join(
                                ","
                              )}`
                            : ""
                        }

                        ${
                          this.options.preserveFormatting
                            ? `Preserve Formatting.`
                            : ""
                        }

                        ${
                          this.options.formality
                            ? `Formality: ${this.options.formality}`
                            : ""
                        }

                        ${this.options.tone ? `Tone: ${this.options.tone}` : ""}

                        ${
                          this.options.domain
                            ? `Domain: ${this.options.domain}`
                            : ""
                        }

                        ${
                          this.options.targetLanguage
                            ? `Target Language: ${this.options.targetLanguage}`
                            : ""
                        }
                        `,

        prompt: `Text: "${text}`,
      });

      const responseJson = cleanGPTJson(response);

      const result = parseJSON(responseJson);

      if (!result) {
        return {
          error: "Failed to translate text (JSON parse error).",
        };
      }

      return {
        translatedText: result.translatedText,
        detectedLanguage: result.detectedLanguage,
      };
    } catch (error) {
      console.error("translate: failed to translate text", error);
      return {
        error: "Failed to translate text.",
      };
    }
  }
}
