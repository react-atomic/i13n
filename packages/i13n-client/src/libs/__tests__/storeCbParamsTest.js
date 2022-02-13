import { expect } from "chai";

import storeCbParams, { getCbParams } from "../storeCbParams";
import { i13nStore } from "../../stores/i13nStore";

describe("Test storeCbParams", () => {
  it("basic test", () => {
    storeCbParams();
  });
  it("test get event", () => {
    const evn = { currentTarget: "foo" };
    storeCbParams(null, { currentTarget: "foo" });
    const [param, e] = getCbParams();
    expect(e).to.deep.equal([evn, evn.currentTarget]);
    expect(param.xxx).to.be.undefined;
  });
  it("test get params", () => {
    const params = { foo: "bar" };
    storeCbParams(params);
    const [param, e] = getCbParams();
    expect(param).to.deep.equal(params);
    expect(e[0]).to.be.undefined;
    expect(e[1]).to.be.undefined;
  });
});
