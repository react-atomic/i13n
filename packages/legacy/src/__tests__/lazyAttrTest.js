import { expect } from "chai";
import sinon from "sinon";
import {jsdom, cleanIt} from "reshow-unit-dom";

import lazyAttr from "../lazyAttr";

describe("Test LazyAttr", () => {
  let reset;
  let clock;

  beforeEach(() => {
    jsdom(null, { url: "http://localhost" });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    cleanIt();
    clock.restore();
  });

  it("simple test", () => {
    const a = lazyAttr("a");
    const expected = "foo";
    a(expected);
    expect(a()).to.equal(expected);
  });

  it("test expire", () => {
    const a = lazyAttr("a", 100);
    const expected = "bar";
    a(expected);
    clock.tick(99000);
    expect(a()).to.equal(expected);
    clock.tick(1001);
    expect(a()).to.be.undefined;
  });
});
