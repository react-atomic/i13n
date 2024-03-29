import { expect } from "chai";
import {jsdom} from "reshow-unit-dom";
import sinon from "sinon";
import req, { beacon, setFirst } from "../req";

const genString = (len) => {
  let x = "1234567890";
  for (let i = 0; i < len; i++) {
    x += x;
  }
  return x;
};

describe("Test Request", () => {
  let uGlobal;
  const fakeLargeVal = genString(10);

  beforeEach(() => {
    uGlobal = jsdom();
  });

  afterEach(() => uGlobal());

  it("test beacon api", () => {
    window.navigator.sendBeacon = () => {};
    const uBeacon = sinon.spy(window.navigator, "sendBeacon");
    setFirst(true);
    beacon("http://localhost", { foo: "bar", a: fakeLargeVal });
    expect(uBeacon.getCall(0).args).to.deep.equal([
      "http://localhost",
      "foo=bar&a=" + fakeLargeVal,
    ]);
  });

  it("test xhr with get", () => {
    window.navigator.sendBeacon = false;
    const uImage = sinon.spy(() => {});
    beacon("http://localhost", { foo: "bar", a: "b" }, null, uImage);
    expect(uImage.getCall(0).args).to.deep.equal([
      "http://localhost?foo=bar&a=b",
    ]);
  });

  it("test xhr with post", () => {
    const uReq = sinon.spy(() => { return true; });
    beacon("http://localhost", { a: genString(20), b: genString(20)}, uReq);
    expect(uReq.getCall(0).args[2]).to.equal("POST");
  });

  it("test xhr not support fallback to image-tag", () => {
    window.XMLHttpRequest = null;
    window.XDomainRequest = null;
    const uImage = sinon.spy(() => {});
    beacon("http://localhost", { foo: "bar", a: fakeLargeVal }, null, uImage);
    expect(uImage.getCall(0).args).to.deep.equal([
      "http://localhost?foo=bar&a=" + fakeLargeVal,
    ]);
  });
});
