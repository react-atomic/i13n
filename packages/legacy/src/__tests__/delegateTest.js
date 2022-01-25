import { expect } from "chai";
import gjsdom from "jsdom-global";
import query from "css-query-selector";

import delegate from "../delegate";

describe("Test delegate", () => {
  let reset;
  beforeEach(() => {
    reset = gjsdom(null, { url: "http://localhost" });
  });

  afterEach(() => {
    reset();
  });

  it("basic test", (done) => {
    document.body.innerHTML = `
      <div class="test"></div>
    `;
    delegate(document.body, "click", ".test", (e) => {
      expect(e.target.className).to.equal("test");
      expect(e.currentTarget.className).to.equal("test");
      done();
    });
    query.one(".test").dispatchEvent(new Event("click", { bubbles: true }));
  });
});
