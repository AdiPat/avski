import { test, expect } from "@playwright/test";

test.describe("example", () => {
  test("just passes", async () => {
    expect(1).toEqual(1);
  });
});
