import { expect } from "chai";

import parseJson, { clone } from "../parseJson";
import { setDebugFlag } from "../logError";

describe("Test Parse Json", () => {
  it("simple test", () => {
    const a = '{"foo": "bar"}';
    expect(parseJson(a)).to.deep.equal({ foo: "bar" });
  });
  it("test illegal", () => {
    const a = '{"foo":}';
    setDebugFlag(true);
    const run = () => parseJson(a);
    expect(run).to.throw();
  });
});

describe("Test clone", () => {
  it("should clone", () => {
    const a = { foo: "bar" };
    const b = a;
    const c = clone(a);
    a.foo = 1;
    c.foo = 2;
    expect({ a, b, c }).to.deep.equal({
      a: { foo: 1 },
      b: { foo: 1 },
      c: { foo: 2 },
    });
  });

  it("could pass undefined", () => {
    setDebugFlag(true);
    const run = () => clone();
    expect(run).to.throw();
  });
});
