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
        state = state.set('thisAction', action);
        return state;
      },
    });
    const spy = sinon.spy();
    i13nStore.addListener(spy);
    oLazy.push({ params: { wait: 999, stop: true, a: "b" } }, "foo");
    i13nDispatch("action", { withLazy: "foo", wait: 777, stop: false });
    setTimeout(() => {
      expect(spy.callCount, "[Action call]").to.equal(1);
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
        state = state.set('foo', 'bar');
        initDone(state, action);
        return state;
      },
    });
    const spyInit = sinon.spy();
    const spyImpression = sinon.spy();
    i13nStore.addListener(heeding(spyInit, "init"));
    i13nStore.addListener(heeding(spyImpression, "impression"));
    i13nDispatch("impression");
    setTimeout(() => {
      expect(spyInit.callCount, "[Init Call]").to.equal(1);
      expect(spyImpression.callCount, "[Impression Call]").to.equal(1);
      done();
    }, 30);
  });
});
