import { expect } from "chai";
import { DeferredActionUtil } from "../DeferredActionUtil";

class FakeMap {
  _state = {};

  set(k, v) {
    this._state[k] = v;
  }

  get(k) {
    return this._state[k];
  }
}

describe("Test DeferredActionUtil", () => {
  it("test get empty", () => {
    const oMap = new FakeMap();
    const oLazy = DeferredActionUtil(oMap);
    const actual = oLazy.getAll();
    expect(actual).to.deep.equal({});
  });

  it("test push lazy", () => {
    const fakeAction = { params: { foo: "bar" } };
    const oMap = new FakeMap();
    const oLazy = DeferredActionUtil(oMap);

    oLazy.push(fakeAction, "foo");
    const actual = oLazy.getOne("foo");
    expect(actual).to.nested.include({ "params.foo": "bar" });
  });

  it("remove lazy", () => {
    const oMap = new FakeMap();
    const oLazy = DeferredActionUtil(oMap);
    oLazy.push(
      { params: { wait: 999, stop: true, a: "b", deferredKey: "foo" } },
      "foo"
    );
    const laze = oLazy.getOne("foo");
    expect(Object.keys(laze)).to.include("params");
    oLazy.wrapActionHandler()(
      { get: () => {} },
      { params: { mergeWithDeferredKey: "foo" } }
    );
    const afterWithLazy = oLazy.getOne("foo");
    expect(afterWithLazy).to.be.undefined;
  });
});

describe("Test DeferredActionUtil Merge", () => {
  it("simple merge", () => {
    const oMap = new FakeMap();
    const oLazy = DeferredActionUtil(oMap);
    oLazy.push({ params: { foo: "bar" } }, "foo");
    const fakeAction = { params: { abc: "def", mergeWithDeferredKey: "foo" } };
    let afterMergeAction;
    oLazy.wrapActionHandler((state, action) => {
      afterMergeAction = action;
      return state;
    })({}, fakeAction);
    expect(afterMergeAction).to.deep.include({
      params: {
        foo: "bar",
        abc: "def",
      },
    });
  });

  it("complex merge", () => {
    const oMap = new FakeMap();
    const oLazy = DeferredActionUtil(oMap);
    oLazy.push({ params: { foo: { abc: "def", bar: "def" } } }, "foo");
    const fakeAction = {
      params: { foo: { abc: "bar" }, mergeWithDeferredKey: "foo" },
    };
    let afterMergeAction;
    oLazy.wrapActionHandler((state, action) => {
      afterMergeAction = action;
      return state;
    })({}, fakeAction);
    expect(afterMergeAction).to.deep.include({
      params: {
        foo: { abc: "bar", bar: "def" },
      },
    });
  });

  it("with handle stop", () => {
    const oMap = new FakeMap();
    const oLazy = DeferredActionUtil(oMap);
    oLazy.push({ params: { wait: 999, stop: true, a: "b" } }, "foo");
    const fakeAction = {
      params: { mergeWithDeferredKey: "foo", wait: 777, stop: false },
    };
    let afterMergeAction;
    oLazy.wrapActionHandler((state, action) => {
      afterMergeAction = action;
      return state;
    })({}, fakeAction);
    expect(afterMergeAction).to.deep.include({
      params: {
        a: "b",
        wait: 777,
        stop: false,
      },
    });
  });
});
