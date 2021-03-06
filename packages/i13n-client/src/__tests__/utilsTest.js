import { expect } from "chai";

import utils from "../utils";

const { arrayToObject, joinCategory, nonZero } = utils();

describe("Test joinCategory", () => {
  it("test joinCategory", () => {
    const arr = ["a", "b", "c"];
    expect(joinCategory(arr)).to.equal("a/b/c");
  });
  it("test empty", () => {
    expect(joinCategory()).to.be.undefined;
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

describe("Test nonZero", () => {
  it("should be undefined with zero", () => {
    expect(nonZero(0)).to.be.undefined;
    expect(nonZero(0.0)).to.be.undefined;
    expect(nonZero("0")).to.be.undefined;
    expect(nonZero("0.0")).to.be.undefined;
  });

  it("should return value with non zero", () => {
    expect(nonZero(1)).to.equal(1);
    expect(nonZero("1")).to.equal("1");
    expect(nonZero(true)).to.equal(true);
    expect(nonZero("1", true)).to.equal(1);
    expect(nonZero(true, true)).to.equal(1);
  });

  it("should handle Negative", () => {
    expect(nonZero(false)).to.be.undefined;
    expect(nonZero(undefined)).to.be.undefined;
    expect(nonZero(null)).to.be.undefined;
  });
});
