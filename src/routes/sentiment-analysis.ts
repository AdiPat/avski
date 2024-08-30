import { Ananta } from "../core/agents";
import express from "express";
import { StatusCodes } from "http-status-codes";

const SentimentAnalysisRouter = express.Router();

SentimentAnalysisRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    const llmApiKey = req.headers["llm-api-key"];

    if (!llmApiKey) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "LLM API Key is required." });
    }

    const body = req.body;

    const { text } = body;

    const options = body.options || {};

    // we don't want users to pass the llm api key in the body
    delete options.llmApiKey;

    if (!text) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Text is required." });
    }

    const trimmedText = text.trim();

    // TODO: validate options

    const ananta = new Ananta({
      llmApiKey: Array.isArray(llmApiKey) ? llmApiKey[0] : llmApiKey,
      ...options,
    });

    const result = await ananta.analyze(trimmedText);

    if (result.error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: result.error });
    }

    return res.status(StatusCodes.OK).json(result);
  }
);

export { SentimentAnalysisRouter };
