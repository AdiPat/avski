import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

function cleanGPTJson(json: string): string {
  if (!json || json.length === 0) {
    return "";
  }

  return json.replace(/^```json\n|\n```$/g, "").replace(/\r?\n|\r/g, "");
}

async function summarize(content: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are summarizing a text. Write a summary of the text.",
      prompt: `Text: "${content}"`,
    });

    return text;
  } catch (error) {
    console.error("summarize: failed to summarize content", error);
    return "";
  }
}

/**
 * Silently parse JSON. Return null if parsing fails.
 * @param json
 * @returns The parsed JSON or null.
 */
function parseJSON(json: string): any {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

async function compressText(text: string, compression: number) {
  try {
    const { text: compressedText } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are compressing a text. Write a compressed version of the text.",
      prompt: `Text: "${text}"\nCompression: ${compression}`,
    });

    return compressedText;
  } catch (error) {
    console.error("compressText: failed to compress text", error);
    return "";
  }
}

export { cleanGPTJson, summarize, parseJSON, compressText };
