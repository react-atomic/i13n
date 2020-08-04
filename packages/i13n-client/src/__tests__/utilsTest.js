import { expect } from "chai";

import utils from "../utils";
import { setDebugFlag } from "../logError";

const { parseJson, arrayToObject, joinCategory } = utils();

describe("Test joinCategory", () => {
  it("test joinCategory", () => {
    const arr = ["a", "b", "c"];
    expect(joinCategory(arr)).to.equal("a/b/c");
  });
  it("test empty", () => {
    expect(joinCategory()).to.be.undefined;
  });
});

describe("Test Parse Json", () => {
  it("simple test", () => {
    const a = '{"foo": "bar"}';
    expect(parseJson(a)).to.deep.equal({ foo: "bar" });
  });
  it("test illegal", () => {
    const a = '{"foo":}';
    setDebugFlag(true);
    const run = () => parseJson(a);
    expect(run).to.throw();
  });
});

describe("Test arrayToObject", () => {
  it("simple test", () => {
    const a = [
      { foo: 1, bar: 2 },
      { foo: 3, bar: 4 },
    ];
    const acture = arrayToObject(a, "foo");
    const expected = {
      1: { foo: 1, bar: 2 },
      3: { foo: 3, bar: 4 },
    };
    expect(acture).to.deep.equal(expected);
  });
});
