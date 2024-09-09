// @ts-check

import { jsdom } from "reshow-unit-dom";
import { expect } from "chai";
import { browserMpHandler } from "../getBrowserInfo";

describe("Test getBrowserInfo", () => {
  beforeEach(() => {
    jsdom(undefined, { url: "http://localhost" });
  });

  it("Basic Browser getMp test", () => {
    const data = browserMpHandler();
    expect(data).to.include({
      dl: "http://localhost/",
      ul: "en-us",
      de: "UTF-8",
      dt: "",
      sd: "24-bit",
      sr: "0x0",
      vp: "1024x768",
      je: 0,
    });
  });
});
