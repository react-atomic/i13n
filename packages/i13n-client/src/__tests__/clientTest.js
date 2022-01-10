import { jsdom } from "reshow-unit-dom";
import { expect } from "chai";
import { i13nStore } from "i13n-store";

import client from "../client";
import heeding from "../heeding";

describe("Test I13N Client", () => {
  beforeEach(() => {
    jsdom(null, { url: "http://localhost" });
  });
  afterEach(() => {
    i13nStore.reset();
  });

  it("simple test", (done) => {
    client(null, () => done());
  });

  it("assign object", (done) => {
    client({ foo: "bar" }, (o, process) => {
      expect(o).to.deep.equal({ foo: "bar" });
      process(o);
      i13nStore.addListener(heeding(()=>done(), "init"));
    });
  });
});
