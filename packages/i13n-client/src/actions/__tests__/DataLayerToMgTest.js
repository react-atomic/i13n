import { expect } from "chai";
import { jsdom, cleanIt } from "reshow-unit-dom";

import DataLayerToMp, { resetSeq } from "../DataLayerToMp";

const oDlToMp = new DataLayerToMp();

describe("Test DataLayerToMp", () => {
  beforeEach(() => {
    jsdom(null, { url: "http://localhost" });
  });

  afterEach(() => {
    cleanIt();
  });

  it("Test getActionData", () => {
    const data = oDlToMp.getActionData({
      eventDimensions: {
        label: "foo_label",
      },
      eventMetrics: {
        value: 0,
      },
    });
    expect(data).to.deep.equal({
      "ep.label": "foo_label",
      "epn.value": 0,
    });
  });

  it("Test worng deferredAction time format with getmp", () => {
    const data = oDlToMp.getMp(null, {
      deferredAction:
        '{"from":"http://localhost","time":"0000-00-00 00:00:00"}',
    });
    expect(data.qt).to.be.undefined;
  });
});

describe("Test GetMp", () => {
  let resetDom;

  beforeEach(() => {
    resetSeq(1);
    resetDom = jsdom(null, { url: "http://localhost" });
  });

  afterEach(() => {
    resetDom();
  });

  it("Basic getMp test", () => {
    const data = oDlToMp.getMp(null, {
      deferredAction:
        '{"from":"http://localhost","time":"2019-03-18T04:39:19Z"}',
    });

    expect(data).to.include({
      _s: 1,
      v: 2,
      en: "event",
    });
    expect(data.qt + "").to.not.empty;
  });

  it("test handle Exception Description", () => {
    const data = oDlToMp.getMp(null, {
      action: "Foo_Error",
    });

    expect(data).to.include({
      en: "Foo_Error",
    });
  });

  it("Test check with have trackingId", () => {
    const data = oDlToMp.getMp({
      trackingId: "fakeTrackingId",
      needTrackingId: true,
    });
    expect(data).to.include({
      tid: "fakeTrackingId",
    });
  });

  it("Test check with trackingId 0", () => {
    const data = oDlToMp.getMp({
      trackingId: 0,
      needTrackingId: true,
    });
    expect(data).to.include({
      tid: 0,
    });
  });

  it("Test check with not have trackingId", () => {
    const data = oDlToMp.getMp({
      trackingId: null,
      needTrackingId: true,
    });
    expect(data).to.be.false;
  });
});
