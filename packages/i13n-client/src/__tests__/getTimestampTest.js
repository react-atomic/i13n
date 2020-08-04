import { expect } from "chai";

import utils from "../utils";

const { getTimestamp } = utils();

describe("Test getTimestamp", () => {
  const now = new Date().getTime();
  it("defined time", () => {
    const ut = getTimestamp(now);
    expect(ut).to.equal(now);
  });

  it("get new time", () => {
    const ut = getTimestamp();
    expect(ut > now).to.be.true;
  });
});
