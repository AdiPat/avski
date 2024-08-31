import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  SentimentAnalysisRouter,
  SummarizerRouter,
  TranslatorRouter,
  TaggerRouter,
} from "./routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/sentiment-analysis", SentimentAnalysisRouter);
app.use("/summarizer", SummarizerRouter);
app.use("/translator", TranslatorRouter);
app.use("/tagger", TaggerRouter);

app.use("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

export default app;
