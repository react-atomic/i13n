import { expect } from "chai";
import {jsdom, cleanIt} from "reshow-unit-dom";

import oneTimeAction from "../oneTimeAction";
import lazyAttr from "../lazyAttr";

describe("Test oneTimeAction", () => {

  beforeEach(() => {
    jsdom(null, { url: "http://localhost" });
  });
  afterEach(() => {
    cleanIt();
  });

  it("simple test", () => {
    oneTimeAction();
  });

  it("test oneTime set to session storage", () => {
    const fakeState = {
      get: () => ["utAction"],
    };
    const I13N = { action: "utAction" };
    const storeOneTime = lazyAttr("oneTimeAction");
    const result = oneTimeAction(I13N, fakeState);

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
