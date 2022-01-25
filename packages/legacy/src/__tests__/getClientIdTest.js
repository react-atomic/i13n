import { expect } from "chai";
import jsdom from "jsdom-global";

import getClientId, { getClientIdCookie, MP_CLIENT_ID } from "../getClientId";

describe("Test getClientId", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(null, { url: "http://localhost" });
  });

  afterEach(() => {
    resetDom();
  });

  it("Test getClientId", () => {
    const id = getClientId();
    expect(getClientIdCookie(MP_CLIENT_ID)).to.equal(id);
  });
});
