import { expect } from "chai";
import jsdom from "jsdom-global";

import oneTimeAction from "../oneTimeAction";
import lazyAttr from "../lazyAttr";

describe("Test oneTimeAction", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(null, { url: "http://localhost" });
  });
  afterEach(() => {
    resetDom();
  });
  it("simple test", () => {
    oneTimeAction();
  });

  it("test set to session storage", () => {
    const fakeState = {
      get: () => ["utAction"],
    };
    const I13N = { action: "utAction" };
    const result = oneTimeAction(I13N, fakeState);
    const storeOneTime = lazyAttr("oneTimeAction");
    expect(storeOneTime()["utAction"]).to.be.true;
    expect(result).to.deep.equal(I13N);
  });

  it("test oneTime action already exists", () => {
    const fakeState = {
      get: () => ["utAction"],
    };
    const I13N = { action: "utAction" };
    oneTimeAction(I13N, fakeState);
    const result = oneTimeAction(I13N, fakeState);
    expect(result).to.be.false;
  });
});
