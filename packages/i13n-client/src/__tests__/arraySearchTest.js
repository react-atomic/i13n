import { expect } from "chai";

import utils from "../utils";
const { arraySearch } = utils();

describe("Test arraySearch", () => {
  it("basic test", () => {
    const arr = [
      {},
      { a: ["xxx"] },
      {
        a: "foo",
      },
      {
        a: "bar",
      },
    ];
    const acture = arraySearch(arr)({ a: "BAR" });
    expect(acture).to.deep.equal([{ a: "bar" }]);
  });

  it("test without key", () => {
    const arr = ["FOO", "BAR"];
    const acture = arraySearch(arr)("b");
    expect(acture).to.deep.equal(["BAR"]);
  });

  it("test with exact", () => {
    const arr = ["a", "bbb", "aa"];
    const acture1 = arraySearch(arr)("a");
    const acture2 = arraySearch(arr, true)("a");
    expect(acture1.length).to.equal(2);
    expect(acture2.length).to.equal(1);
  });
});
