import { jsdom } from "reshow-unit-dom";
import { expect } from "chai";
import logError from "../logError";

describe("Test log Error", () => {
  beforeEach(() => {
    jsdom(null, { url: "http://localhost" });
  });
  it("simple test", () => {
    logError();
  });
});
