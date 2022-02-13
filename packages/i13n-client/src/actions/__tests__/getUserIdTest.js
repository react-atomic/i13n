import { expect } from "chai";

import { i13nDispatch } from "../../stores/i13nStore";
import getUserId from "../getUserId";

describe("Test getUserId", () => {
  afterEach(() => i13nDispatch("reset"));

  it("basic test", () => {
    const acture = getUserId();
    expect(acture).to.be.undefined;
  });

  it("test get result", () => {
    i13nDispatch({ uid: "fake-uid" });
    const acture = getUserId();
    expect(acture).to.equal("fake-uid");
  });
});
