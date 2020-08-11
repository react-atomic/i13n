import { expect } from "chai";
import sinon from "sinon";
import jsdom from "jsdom-global";
jsdom(null, { url: "http://localhost" });

import { i13nDispatch } from "../index";
import i13nStore from "../stores/i13nStore";
import { localStorage, Storage } from "get-storage";
const lStore = new Storage(localStorage);

describe("Test I13N", () => {
  afterEach((done) => {
    i13nDispatch("reset", null, () => done());
  });

  it("test dispatch set", () => {
    i13nDispatch("config/set", { foo: "bar" });
    const state = i13nStore.getState();
    expect(state.get("foo")).to.equal("bar");
  });

  it("test dispatch action", () => {
    const actionHandler = sinon.spy((state) => state);
    i13nDispatch("config/set", { actionHandler });
    expect(actionHandler.called).to.be.false;
    i13nDispatch("action");
    expect(actionHandler.called).to.be.true;
  });

  it("test dispatch view", (done) => {
    const impressionHandler = sinon.spy((state) => state);
    i13nDispatch("config/set", { impressionHandler });
    expect(impressionHandler.called).to.be.false;
    i13nDispatch("view");
    setTimeout(() => {
      expect(impressionHandler.called).to.be.true;
      const state = i13nStore.getState();
      expect(state.get("lastUrl")).to.equal("http://localhost/");
      done();
    }, 50);
  });

  it("test init", (done) => {
    const impressionHandler = sinon.spy((state) => state);
    const initHandler = sinon.spy((state, action, done) => done(state));
    i13nDispatch("config/set", { impressionHandler, initHandler });
    expect(!!i13nStore.getState().get("init")).to.be.false;
    i13nDispatch("view");
    expect(initHandler.called).to.be.true;
    expect(i13nStore.getState().get("init")).to.be.true;
    expect(initHandler.callCount).to.equal(1);
    i13nDispatch("view");
    expect(initHandler.callCount).to.equal(1);
    setTimeout(() => {
      expect(impressionHandler.callCount).to.equal(2);
      done();
    });
  });
});

describe("Test after init", () => {
  afterEach((done) => {
    i13nDispatch("reset", null, () => done());
  });

  it("should handle wait well", (done) => {
    i13nStore.pushLazyAction({ params: { wait: 1, foo: "bar" } }, "foo");
    expect(i13nStore.getLazy("foo").params.wait).to.equal(1);
    const state = i13nStore.getState();
    i13nStore.initDone(state);
    setTimeout(() => {
      expect(i13nStore.getLazy("foo").params.wait).to.equal(0);
      i13nStore.initDone(state);
      setTimeout(() => {
        expect(!!i13nStore.getLazy("foo")).to.be.false;
        done();
      }, 50);
    }, 50);
  });

  it("should handle wait 0 well", (done) => {
    const actionHandler = sinon.spy((state) => state);
    i13nDispatch({ actionHandler });
    expect(actionHandler.called).to.be.false;
    i13nStore.pushLazyAction(
      { type: "action", params: { wait: 0, foo: "bar" } },
      "foo"
    );
    let foo = i13nStore.getLazy("foo");
    expect(foo.params.wait).to.equal(0);
    const state = i13nStore.getState();
    i13nStore.initDone(state);
    setTimeout(() => {
      foo = i13nStore.getLazy("foo");
      expect(!!foo).to.be.false;
      expect(actionHandler.called).to.be.true;
      done();
    }, 50);
  });

  it("should handle wait 0 and stop well", (done) => {
    const actionHandler = sinon.spy((state) => state);
    i13nDispatch({ actionHandler });
    expect(actionHandler.called).to.be.false;
    i13nStore.pushLazyAction(
      { type: "action", params: { wait: 0, foo: "bar", stop: true } },
      "foo"
    );
    let foo = i13nStore.getLazy("foo");
    expect(foo.params.wait).to.equal(0);
    const state = i13nStore.getState();
    i13nStore.initDone(state);
    setTimeout(() => {
      foo = i13nStore.getLazy("foo");
      expect(!!foo).to.be.false;
      expect(actionHandler.called).to.be.false;
      done();
    }, 50);
  });

  it("should handle wait undefined well", (done) => {
    i13nStore.pushLazyAction({ type: "action", params: { foo: "bar" } }, "foo");
    let foo = i13nStore.getLazy("foo");
    expect(foo.params).to.have.property("lazeInfo");
    const state = i13nStore.getState();
    const cb = sinon.spy(i13nStore, "handleAction");
    expect(cb.called).to.be.false;
    i13nStore.initDone(state);
    setTimeout(() => {
      foo = i13nStore.getLazy("foo");
      expect(cb.called).to.be.true;
      expect(!!foo).to.be.false;
      done();
    }, 50);
  });

  it("should handle lazy action well", (done) => {
    const actionHandler = sinon.spy((state, action) =>
      state.merge(action.params)
    );
    i13nDispatch("config/set", { actionHandler });
    i13nStore.pushLazyAction({
      type: "action",
      params: { I13N: { a: 1, b: 2 } },
    });
    const state = i13nStore.getState();
    i13nStore.initDone(state);
    setTimeout(() => {
      expect(actionHandler.called).to.be.true;
      const I13N = i13nStore.getState().get("I13N").toJS();
      expect(I13N).to.deep.equal({ a: 1, b: 2 });
      done();
    }, 50);
  });
});
