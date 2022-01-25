import { expect } from "chai";
import sinon from "sinon";

import utils from "../utils";
const { router: Router } = utils();

describe("Test Router", () => {
  it("simple test", () => {
    const cb = sinon.spy(() => {});
    const router = new Router();
    router.addRoute("/xxx*", cb);
    let match = router.match("/xxxy");
    expect(cb.called).to.be.false;
    match.fn();
    expect(cb.called).to.be.true;
    const next = match.next();
    expect(!!next).to.be.false;
  });
  it("root only test", () => {
    const cb = sinon.spy(() => {});
    const router = new Router();
    router.addRoute("/", cb);
    let match = router.match("/?abc=def#foo");
    expect(cb.called).to.be.false;
    match.fn();
    expect(cb.called).to.be.true;
  });
});
