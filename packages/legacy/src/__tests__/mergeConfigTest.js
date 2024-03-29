import { jsdom } from "reshow-unit-dom";
import { expect } from "chai";
import mergeConfig from "../mergeConfig";

describe("Test merge config", () => {
  beforeEach(() => {
    jsdom(null, { url: "http://localhost" });
  });

  it("test replace", () => {
    const a = {
      foo: {
        a: 1,
        b: 2,
      },
    };
    mergeConfig(a, [
      {
        path: ["foo", "b"],
        value: 3,
      },
    ]);
    expect(a.foo.b).to.equal(3);
  });

  it("test append", () => {
    const a = {
      foo: { bar: ["a", "b"] },
    };
    mergeConfig(a, [
      {
        path: ["foo", "bar"],
        value: "c",
        append: true,
      },
    ]);
    expect(a.foo.bar).to.deep.equal(["a", "b", "c"]);
  });
});
