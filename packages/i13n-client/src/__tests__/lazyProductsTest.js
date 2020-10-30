import { expect } from "chai";
import jsdom from "jsdom-global";

import i13nStore from "i13n-store";
import utils from "../utils";

import lazyProducts, { forEachStoreProducts } from "../lazyProducts";

const { i13nDispatch, lazyAttr } = utils();
const sessionStore = lazyAttr("__prods");

describe("Test lazyProducts", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(null, { url: "http://localhost" });
  });

  afterEach(() => {
    sessionStore(null);
    resetDom();
    i13nStore.reset();
  });

  it("basic test", () => {
    forEachStoreProducts({
      products: [{ id: "aaa", price: "100" }],
    });
    let state = i13nStore.getState();
    state = state.merge({ I13N: { products: [{ id: "aaa" }] } });
    expect(state.get("I13N").toJS()).to.deep.equal({
      products: [{ id: "aaa" }],
    });
    state = lazyProducts(state);
    expect(state.get("I13N").toJS()).to.deep.equal({
      products: [{ id: "aaa", price: "100" }],
    });
  });
});

describe("Test forEachStoreProducts", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(null, { url: "http://localhost" });
  });

  afterEach(() => {
    sessionStore(null);
    resetDom();
  });

  it("basic test", () => {
    expect(sessionStore()).to.be.undefined;

    forEachStoreProducts({
      products: [{ id: "foo", price: "200" }],
    });
    expect(sessionStore()).to.deep.equal({ foo: { id: "foo", price: "200" } });
  });

  it("test data should not change", () => {
    const products = { products: [{ id: "bar", price: "777", quantity: 1, variant: 'variant', position: 0 }] };
    const nextProducts = forEachStoreProducts(products);
    expect(products).to.deep.equal(nextProducts);
  });
});
