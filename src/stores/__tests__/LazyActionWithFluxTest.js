import { expect } from "chai";
import sinon from "sinon";
import { createReducer, SimpleMap } from "reshow-flux-base";

import BaseI13nReducer from "../BaseI13nReducer";
import LazyAction from "../../LazyAction";
import i13nStoreReAssign from "../../i13nStoreReAssign";
import heeding from "../../heeding";

class FakeMap {
  _state = {};

  set(k, v) {
    this._state[k] = v;
  }

  get(k) {
    return this._state[k];
  }
}

describe("Test LazyAction with flux", () => {

  it("test with flux-action", (done) => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
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
    i13nDispatch("reset", {
      actionHandler: oLazy.handleAction,
      lazyActionHandler: (state, action) => {
        expect(action).to.deep.equal({
          params: { a: "b", wait: 777, stop: false },
          type: "action",
        });
      },
    });
    oLazy.push({ params: { wait: 999, stop: true, a: "b" } }, "foo");
    i13nDispatch("action", { withLazy: "foo", wait: 777, stop: false });
    const spy = sinon.spy();
    i13nStore.addListener(spy);
    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      done();
    });
  });

  it("test with flux-impression", (done) => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
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
    i13nDispatch("reset", {
      initHandler: (state, action, initDone) => {
        oLazy.process(i13nDispatch);
        initDone(state, action);
        return state;
      },
    });
    i13nDispatch("impression");
    const spyInit = sinon.spy();
    const spyImpression = sinon.spy();
    i13nStore.addListener(heeding(spyInit, "init"));
    i13nStore.addListener(heeding(spyImpression, "impression"));
    setTimeout(() => {
      expect(spyInit.callCount).to.equal(1);
      expect(spyImpression.callCount).to.equal(1);
      done();
    }, 100);
  });

});
