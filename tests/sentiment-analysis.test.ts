import app from "@avski/app";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

describe("Sentiment Analysis", () => {
  it("it returns a response", async () => {
    const response = await request(app)
      .post("/sentiment-analysis")
      .send({ text: "I love this product!" });

    expect(response.status).toBe(StatusCodes.OK);

    console.log(response.body);
    expect(response.body).toBeTruthy();
  });

  it("returns a positive response", async () => {
    const response = await request(app)
      .post("/sentiment-analysis")
      .send({ text: "I love this product!" });

    expect(response.status).toBe(StatusCodes.OK);

    expect(response.body.score).toBeGreaterThan(0.75);
  });

  it("returns a negative response", async () => {
    const response = await request(app)
      .post("/sentiment-analysis")
      .send({ text: "I hate this product!" });

    expect(response.status).toBe(StatusCodes.OK);

    expect(response.body.score).toBeLessThan(0.25);
  });

  it("returns a neutral response", async () => {
    const response = await request(app)
      .post("/sentiment-analysis")
      .send({ text: "I feel indifferent about this product." });

    expect(response.status).toBe(StatusCodes.OK);

    expect(response.body.score).toBeGreaterThan(0.25);
    expect(response.body.score).toBeLessThan(0.75);
  });

  it("returns an error for missing text", async () => {
    const response = await request(app).post("/sentiment-analysis");

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe("Text is required.");
  });

  it("returns an error for invalid text", async () => {
    const response = await request(app)
      .post("/sentiment-analysis")
      .send({ text: "" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe("Text is required.");
  });
});
