import { expect } from "chai";
import i13nStore from "i13n-store";
import jsdom from "jsdom-global";
import client from "../client";

jsdom(null, { url: "http://localhost" });

describe("Test I13N", () => {
  it("simple test", (done) => {
    client(null, () => done());
  });
  it("assign object", (done) => {
    client({ foo: "bar" }, (o, process) => {
      expect(o).to.deep.equal({ foo: "bar" });
      process(o);
      i13nStore.addListener(() => {
        done();
      }, "init");
    });
  });
});
