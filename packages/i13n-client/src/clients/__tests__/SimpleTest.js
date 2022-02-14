import { expect } from "chai";
import simple from "../simple";
import { i13nStore, i13nDispatch } from "../../stores/i13nStore";

describe("Test Simple", () => {

  afterEach(() => {
    i13nDispatch("reset");
  });

  it("basic test", (done) => {
    simple();
    setTimeout(() => {
      expect(i13nStore.getState().get("init")).to.be.true;
      done();
    });
  });

  it("test set config", (done) => {
    expect(i13nStore.getState().get("init")).to.be.undefined;
    simple("UA-XXXXXXXX-X");
    setTimeout(() => {
      expect(i13nStore.getState().get("trackingId")).to.equal("UA-XXXXXXXX-X");
      done();
    });
  });
});
