import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { SentimentAnalysisRouter, SummarizerRouter } from "./routes";
import { TranslatorRouter } from "./routes/translator";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/sentiment-analysis", SentimentAnalysisRouter);
app.use("/summarizer", SummarizerRouter);
app.use("/translator", TranslatorRouter);

app.use("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

export default app;
