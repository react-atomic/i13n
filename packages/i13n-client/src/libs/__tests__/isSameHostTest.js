//@ts-check

import { expect } from "chai";
import { isSameHost } from "../isSameHost";

describe("Test isSameHost", () => {
  it("Test isSameHost", () => {
    const isSame = isSameHost("localhost");
    const same = isSame("http://localhost");
    expect(same).to.be.true;
    const diff = isSame("http://google.com");
    expect(diff).to.be.false;
  });
});
