import { expect } from "chai";
import {i13nStore, i13nDispatch} from "i13n-store";
import jsdom from "jsdom-global";

import UsergramTag from "../usergram.tag";
const Usergram = new UsergramTag();

describe("Test Usergram", () => {
  Usergram.register(i13nStore, "usergram");
  let uGlobal;
  beforeEach(() => {
    window.usergram = [];
    i13nDispatch("reset");
  });
  before(() => (uGlobal = jsdom()));
  after(() => uGlobal());

  it("test with cv", () => {
    i13nDispatch({
      tag: {
        usergram: {
          cv: ["Purchase"],
          attr: {
            name: "prop03",
          },
        },
      },
      I13N: {
        action: "Purchase",
        products: [{ name: "foo" }],
      },
    });
    Usergram.action();
    const last = window.usergram.pop();
    expect(last).to.deep.equal([
      "send",
      undefined,
      "cv",
      "Purchase",
      { prop03: ["foo"] },
    ]);
  });

  it("test without cv", () => {
    i13nDispatch({
      tag: { usergram: {} },
      I13N: {
        stepNo: 1,
        stepOption: "pay",
      },
    });
    Usergram.action();
    const last = window.usergram.pop();
    expect(last[4]).to.deep.include({
      label: { stepNo: 1, stepOption: "pay" },
    });
  });
});
