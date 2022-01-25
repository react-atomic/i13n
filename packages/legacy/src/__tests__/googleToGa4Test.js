import { expect } from "chai";
import toGa4 from "../google.toGa4";

describe("Test Google GA4", () => {
  it("simple test", () => {
    const acture = toGa4();
    expect(acture).to.deep.equal({ actionConfig: {}, viewConfig: {} });
  });

  it("test currency", () => {
    const acture = toGa4({ ecommerce: { currencyCode: "fake" } });
    expect(acture.actionConfig.ecommerce.currency).to.equal("fake");
  });

  it("test impressions", () => {
    const acture = toGa4({ ecommerce: { impressions: "fake" } });
    expect(acture.actionConfig.ecommerce.impressions).to.be.undefined;
  });
});
