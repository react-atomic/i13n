import { expect } from "chai";
import handleEcommerce from "../handleEcommerce";
import { i13nStore } from "../../stores/i13nStore";

describe("Test handleEcommerce", () => {
  it("simple test", () => {
    handleEcommerce({}, {}, i13nStore);
  });
});

