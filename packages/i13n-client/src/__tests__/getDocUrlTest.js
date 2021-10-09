import { expect } from "chai";

import {getHostName} from "../getDocUrl"; 


describe("Test getDocUrl", () => {
  it("test getHostName", ()=>{
    const actual = getHostName({location: "http://www.host/xxx"}); 
    expect(actual).to.equal("www.host");
  });
});
