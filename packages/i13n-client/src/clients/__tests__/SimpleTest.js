import { expect } from "chai";
import { sleep } from "reshow-unit-dom";
import simple from "../simple_node";
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
    simple("G-9TXPKL0L48");
    setTimeout(() => {
      expect(i13nStore.getState().get("trackingId")).to.equal("G-9TXPKL0L48");
      done();
    });
  });

  it("test send beacon", async () => {
    expect(i13nStore.getState().get("init")).to.be.undefined;
    simple("G-9TXPKL0L48");
    await sleep(()=>{},50);
    expect(i13nStore.getState().get("trackingId")).to.equal("G-9TXPKL0L48");
  });
});
