import { Ananta } from "../core";
import express from "express";
import { StatusCodes } from "http-status-codes";

const SentimentAnalysisRouter = express.Router();

SentimentAnalysisRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    const body = req.body;

    const { text, options } = body;

    if (!text) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Text is required." });
    }

    const trimmedText = text.trim();

    // TODO: validate options

    const ananta = new Ananta();

    const result = await ananta.analyze(trimmedText);

    if (result.error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: result.error });
    }

    return res.json(result);
  }
);

export { SentimentAnalysisRouter };
