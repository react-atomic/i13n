import { expect } from "chai";
import sinon from "sinon";
import LazyAction from "../LazyAction";

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
    expect(Object.keys(laze)).to.have.lengthOf(2);
    oLazy.handleAction({ get: () => {} }, { params: { withLazy: "foo" } });
    const afterWithLazy = oLazy.getOne("foo");
    expect(afterWithLazy).to.be.undefined;
  });
});

class FakeMap {
  _state = {};

  set(k, v) {
    this._state[k] = v;
  }

  get(k) {
    return this._state[k];
  }
}
