import { expect } from "chai";
import { createReducer, SimpleMap } from "reshow-flux-base";
import sinon from "sinon";

import BaseI13nReducer from "../BaseI13nReducer";
import i13nStoreReAssign from "../../i13nStoreReAssign";
import heeding from "../../heeding";

describe("Test BaseI13nReducer", () => {
  const oI13n = new BaseI13nReducer();
  const [i13nStore, i13nDispatch] = createReducer(
    oI13n.reduce.bind(oI13n),
    new SimpleMap()
  );
  i13nStoreReAssign({
    oI13n,
    store: i13nStore,
    i13nDispatch,
    mergeMap: (state, jsArr) => state.merge(jsArr),
  });

  beforeEach((done) => {
    i13nDispatch("reset");
    setTimeout(() => done(), 50);
  });

  it("test init", (done) => {
    const impressionHandler = sinon.spy((state) => state);
    const initHandler = sinon.spy((state, action, done) => {
      done(state);
      return state;
    });
    i13nDispatch("config/set", { impressionHandler, initHandler });

    expect(!!i13nStore.getState().get("init")).to.be.false;

    i13nDispatch("view");

    expect(initHandler.called).to.be.true;

    setTimeout(() => {
      expect(i13nStore.getState().get("init")).to.be.true;
      expect(initHandler.callCount).to.equal(1);

      i13nDispatch("view");

      expect(initHandler.callCount).to.equal(1);

      setTimeout(() => {
        expect(impressionHandler.callCount).to.equal(2);
        done();
      }, 50);
    });
  });

  it("test dispatch action", (done) => {
    const actionHandler = sinon.spy((state) => state);
    const afterAction = sinon.spy((state, action) => {});
    i13nStore.addListener(heeding(afterAction, "action"));
    i13nDispatch("config/set", { actionHandler });
    expect(actionHandler.called).to.be.false;
    i13nDispatch("action");
    setTimeout(() => {
      expect(actionHandler.called).to.be.true;
      expect(afterAction.callCount).to.equal(1);
      done();
    });
  });

  it("test dispatch impression", (done) => {
    const impressionHandler = sinon.spy((state) => state);
    const afterImpression = sinon.spy((state, action) => {});
    i13nStore.addListener(heeding(afterImpression, "impression"));
    i13nDispatch("config/set", { impressionHandler });
    expect(impressionHandler.called).to.be.false;
    i13nDispatch("view");
    setTimeout(() => {
      expect(impressionHandler.called).to.be.true;
      expect(afterImpression.callCount).to.equal(1);
      done();
    }, 10);
  });
});
