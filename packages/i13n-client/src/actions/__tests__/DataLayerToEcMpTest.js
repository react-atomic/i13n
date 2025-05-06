//@ts-check
import { expect } from "chai";
import { jsdom } from "reshow-unit-dom";
import {
  getEcData,
  getEcActionData,
  getEcImpressionsData,
  getItemsData,
  getEcPromotionData,
  getEcPurchaseData,
  getEcStepData,
  setOneProduct,
  setOnePromotion,
} from "../DataLayerToEcMp";

describe("Test DataLayerToMp", () => {});

describe("Test DataLayerToMp - setOneProduct", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(undefined, { url: "http://localhost" });
  });

  afterEach(() => {
    resetDom();
  });
  it("setOneProduct basic test", () => {
    const item = { id: 0 };
    const data = {};
    setOneProduct("pr1", data, item);
    expect(data).to.deep.equal({
      pr1id: 0,
      pr1img: undefined,
      pr1sku: undefined,
      pr1nm: undefined,
      pr1ca: undefined,
      pr1cc: undefined,
      pr1br: undefined,
      pr1va: undefined,
      pr1ps: undefined,
      pr1pr: undefined,
      pr1qt: undefined,
    });
  });

  it("Test product custom dimension and metric", () => {
    const item = {
      id: 0,
      dimension2: "abc",
      metric3: 100,
    };
    const data = {};
    setOneProduct("pr1", data, item);
    expect(data).to.include({ pr1cd2: "abc", pr1cm3: 100 });
  });

  it("Test position is not number", () => {
    const item = {
      id: 0,
      position: "foo",
    };
    const data = {};
    setOneProduct("pr1", data, item);
    expect(data).to.include({ pr1ps: 0 });
  });

  it("Test position is number", () => {
    const item = {
      id: 0,
      position: "5",
    };
    const data = {};
    setOneProduct("pr1", data, item);
    expect(data).to.include({ pr1ps: 5 });
  });
});

describe("Test Send Product Image", () => {
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(undefined, { url: "http://localhost" });
  });

  afterEach(() => {
    resetDom();
  });
  const products = [
    {
      name: "Triblend Android T-Shirt", // Name or ID is required.
      id: "12345",
      price: "15.25",
      brand: "Google",
      category: "Apparel",
      variant: "Gray",
      list: "Search Results",
      image: "http://xxx.xxx.img",
      position: 1,
    },
  ];

  it("Test without imageIndex", () => {
    const data = getEcData({
      ecommerce: {
        impressions: products,
      },
    });
    expect(data).to.include({
      il1pi1img: "http://xxx.xxx.img",
    });
  });

  it("Test with imageIndex", () => {
    const data = getEcData({
      imageIndex: 1,
      ecommerce: {
        impressions: products,
      },
    });
    expect(data).to.include({
      il1pi1img: "http://xxx.xxx.img",
      il1pi1cd1: "http://xxx.xxx.img",
    });
  });

  it("Test with getEcActionData", () => {
    const data = getEcData({
      imageIndex: 2,
      ecommerce: {
        detail: { products },
      },
    });
    expect(data).to.include({
      pr1img: "http://xxx.xxx.img",
      pr1cd2: "http://xxx.xxx.img",
    });
  });

  it("Test with getEcData", () => {
    const data = getEcData({
      imageIndex: 3,
      ecommerce: {
        checkout: { products },
      },
    });
    expect(data).to.include({
      pr1img: "http://xxx.xxx.img",
      pr1cd3: "http://xxx.xxx.img",
    });
  });

  it("Test with getEcPurchaseData", () => {
    const data = getEcData({
      imageIndex: 4,
      ecommerce: {
        purchase: { products },
      },
    });
    expect(data).to.include({
      pr1img: "http://xxx.xxx.img",
      pr1cd4: "http://xxx.xxx.img",
    });
  });

  it("Test getEcData", () => {
    const data = getEcData({
      ecommerce: {},
    });
    expect(data).to.deep.equal({ cu: undefined });
  });

  it("Test getEcImpressionsData", () => {
    const empty = getEcImpressionsData([{ id: 0 }]);
    expect(empty).to.deep.equal({
      il1nm: undefined,
      il1pi1id: 0,
      il1pi1img: undefined,
      il1pi1sku: undefined,
      il1pi1nm: undefined,
      il1pi1ca: undefined,
      il1pi1cc: undefined,
      il1pi1br: undefined,
      il1pi1va: undefined,
      il1pi1ps: undefined,
      il1pi1pr: undefined,
      il1pi1qt: undefined,
    });
    const data = getEcImpressionsData([
      {
        name: "Triblend Android T-Shirt", // Name or ID is required.
        id: "12345",
        price: "15.25",
        brand: "Google",
        category: "Apparel",
        variant: "Gray",
        list: "Search Results",
        position: "1",
      },
    ]);
    expect(data).to.deep.equal({
      il1nm: "Search Results",
      il1pi1id: "12345",
      il1pi1img: undefined,
      il1pi1sku: undefined,
      il1pi1nm: "Triblend Android T-Shirt",
      il1pi1ca: "Apparel",
      il1pi1cc: undefined,
      il1pi1qt: undefined,
      il1pi1br: "Google",
      il1pi1va: "Gray",
      il1pi1ps: 1,
      il1pi1pr: 15.25,
    });
  });
  it("Test getEcActionData", () => {
    const data = getEcActionData({});
    expect(data).to.deep.equal({});
  });

  it("Test getEcActionData (detail)", () => {
    const data = getEcActionData(
      {
        products: [
          {
            id: 0,
            category: "uCategory",
            list: "uList",
          },
        ],
      },
      "detail"
    );
    expect(data).to.deep.equal({ pr1id: 0, pr1ca: "uCategory", pa: "detail" });
  });

  it("Test getItemsData", () => {
    const data = getItemsData([1]);
    expect(data).to.deep.equal({});
  });

  it("Test getEcPromotionData", () => {
    const data = getEcPromotionData({});
    expect(data).to.deep.equal({ promoa: "view" });
  });

  it("Test setOnePromotion", () => {
    const item = {};
    const data = {};
    setOnePromotion("promo1", data, item);
    expect(data).to.deep.equal({
      promo1id: undefined,
      promo1nm: undefined,
      promo1cr: undefined,
      promo1ps: undefined,
    });
  });

  it("Test getEcPurchaseData", () => {
    const purchase = getEcPurchaseData({});
    expect(purchase).to.deep.equal({
      pa: "purchase",
      ti: undefined,
      ta: undefined,
      tr: undefined,
      tt: undefined,
      ts: undefined,
      tcc: undefined,
    });
  });

  it("Test getEcPurchaseData (refund)", () => {
    const refund = getEcPurchaseData(null, {});
    expect(refund).to.deep.equal({
      pa: "refund",
      ti: undefined,
    });
  });

  it("Test getEcStepData (checkout)", () => {
    const data = getEcStepData({});
    expect(data).to.deep.equal({
      cos: undefined,
      col: undefined,
      pa: "checkout",
    });
  });

  it("Test getEcStepData (checkout_option)", () => {
    const data = getEcStepData(null, {});
    expect(data).to.deep.equal({
      cos: undefined,
      col: undefined,
      pa: "checkout_option",
    });
  });
});
