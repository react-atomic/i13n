import { expect } from "chai";
import sinon from "sinon";
import LazyAction from "../LazyAction";

class FakeMap {
  _state = {};

  set(k, v) {
    this._state[k] = v;
  }

  get(k) {
    return this._state[k];
  }
}

describe("Test LazyAction", () => {
  it("test get empty", () => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
    const actual = oLazy.getAll();
    expect(actual).to.deep.equal({});
  });

  it("test push lazy", () => {
    const fakeAction = { params: { foo: "bar" } };
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);

    oLazy.push(fakeAction, "foo");
    const actual = oLazy.getOne("foo");
    expect(actual).to.nested.include({ "params.foo": "bar" });
  });

  it("remove lazy", () => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
    oLazy.push(
      { params: { wait: 999, stop: true, a: "b", lazyKey: "foo" } },
      "foo"
    );
    const laze = oLazy.getOne("foo");
    expect(Object.keys(laze)).to.include("params");
    oLazy.handleAction({ get: () => {} }, { params: { withLazy: "foo" } });
    const afterWithLazy = oLazy.getOne("foo");
    expect(afterWithLazy).to.be.undefined;
  });
});

describe("Test LazyAction Merge", () => {
  it("simple merge", () => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
    oLazy.push({ params: { foo: "bar" } }, "foo");
    const fakeAction = { params: { abc: "def", withLazy: "foo" } };
    let afterMergeAction;
    oLazy.handleAction(
      {
        get: () => (state, action) => {
          afterMergeAction = action;
        },
      },
      fakeAction
    );
    expect(afterMergeAction).to.deep.include({
      params: {
        foo: "bar",
        abc: "def",
      },
    });
  });

  it("complex merge", () => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
    oLazy.push({ params: { foo: { abc: "def", bar: "def" } } }, "foo");
    const fakeAction = { params: { foo: { abc: "bar" }, withLazy: "foo" } };
    let afterMergeAction;
    oLazy.handleAction(
      {
        get: () => (state, action) => {
          afterMergeAction = action;
        },
      },
      fakeAction
    );
    expect(afterMergeAction).to.deep.include({
      params: {
        foo: { abc: "bar", bar: "def" },
      },
    });
  });

  it("with handle stop", () => {
    const oMap = new FakeMap();
    const oLazy = LazyAction(oMap);
    oLazy.push({ params: { wait: 999, stop: true, a: "b" } }, "foo");
    const fakeAction = {params: { withLazy: "foo", wait: 777, stop: false }};
    let afterMergeAction;
    oLazy.handleAction(
      {
        get: () => (state, action) => {
          afterMergeAction = action;
        },
      },
      fakeAction
    );
    expect(afterMergeAction).to.deep.include({
      params: {
        a: "b", wait: 777, stop: false
      },
    });
  });
});

