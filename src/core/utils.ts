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

export { cleanGPTJson, summarize };
