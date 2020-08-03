import { expect } from "chai";
import jsdom from "jsdom-global";
import set from "set-object-value";

import shopify from "../shopify";

const checkoutPath = ["Shopify", "Checkout"];

describe("Test Shopify", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom();
  });

  afterEach(() => {
    resetDom();
  });

  it("test getShopId from shop", () => {
    set(window, ["Shopify", "shop"], "fake-shop-foo");
    const acture = shopify.getShopId();
    expect(acture).to.equal("fake-shop-foo");
  });

  it("test getShopId from apihost", () => {
    set(window, [...checkoutPath, "apiHost"], "fake-shop-bar");
    const acture = shopify.getShopId();
    expect(acture).to.equal("fake-shop-bar");
  });

  it("test getStepName", () => {
    set(window, [...checkoutPath, "step"], "contact_information");
    const acture = shopify.getStepName();
    expect(acture).to.equal("contact_information");
  });

  it("test getStepNo", () => {
    set(window, [...checkoutPath, "step"], "contact_information");
    const acture = shopify.getStepNo();
    expect(acture).to.equal(1);
  });

  it("test getPage (_st, t)", () => {
    set(window, ["__st", "t"], "foo");
    const acture = shopify.getPage();
    expect(acture).to.equal("foo");
  });

  it("test getPage (_st, p)", () => {
    set(window, ["__st", "p"], "bar");
    const acture = shopify.getPage();
    expect(acture).to.equal("bar");
  });

  it("test getPage (thank_you)", () => {
    set(window, [...checkoutPath, "step"], "thank_you");
    const acture = shopify.getPage();
    expect(acture).to.equal("thank_you");
  });

  it("test getUid", ()=> {
    set(window, ["__st", "cid"], "fake-cid");
    const acture = shopify.getUid();
    expect(acture).to.equal("fake-cid");
  });

  it("test getGaId", ()=> {
    set(window, ["__st", "pageurl"], "xxx?_ga=-fakega");
    const acture = shopify.getGaId();
    expect(acture).to.equal("fakega");
  });

  it("test getDocUrl", ()=> {
    set(window, ["__st", "pageurl"], "xxx");
    const acture = shopify.getDocUrl();
    expect(acture).to.equal("https://xxx");
  });

  it("test getCurrency", ()=> {
    set(window, [...checkoutPath, "currency"], "fakc-currency");
    const acture = shopify.getCurrency();
    expect(acture).to.equal("fakc-currency");
  });

  it("test getClientId", ()=> {
    set(window, [...checkoutPath, "token"], "fakc-token");
    const acture = shopify.getClientId();
    expect(acture).to.equal("shopify-checkout-fakc-token");
  });
});
