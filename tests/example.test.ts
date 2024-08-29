import request from "supertest";
import app from "@avski/app"; // Adjust the path to your app file

describe("GET /", () => {
  test("should return 200 OK", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});
