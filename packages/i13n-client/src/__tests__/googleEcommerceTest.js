import { expect } from "chai";
import { getViewEcommerce, getActionEcommerce } from "../google.ecommerce.js";

describe("Test Google Action Ecommerce", () => {
  it("simple test", () => {
    getActionEcommerce({}, {});
  });
});

describe("Test Google View Ecommerce", () => {
  it("simple test", () => {
    getViewEcommerce({}, {});
  });
});
