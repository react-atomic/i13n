//@ts-check

import { expect } from "chai";
import { getReferrer } from "../getBrowserInfo";

describe("Test getReferrer", () => {
  it("Test getReferrer", () => {
    const data = getReferrer({
      referrer: "https://fake.com",
    });
    expect(data).to.deep.equal({ dr: "https://fake.com" });
  });
  it("Test getReferrer (empty)", () => {
    const data = getReferrer();
    expect(data).to.be.undefined;
  });

  it("Test getReferrer (same host)", () => {
    const data = getReferrer({
      location: { hostname: "localhost" },
      referrer: "http://localhost/shopping",
    });
    expect(data).to.be.undefined;
  });
});
