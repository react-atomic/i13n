/**
 *
 * https://developers.google.com/tag-manager/enhanced-ecommerce
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#action-types
 *
 * Actions ->
 *
 * click: ClickProduct
 * add: AddToCart | BuyNow
 * remove: RemoveFromCart
 * promo_click: ClickPromotion
 *
 * __Support with other ways__
 * [x] detail: [view]
 * [x] checkout: [handleStep: stepNo]
 * [x] checkout_option: [handleStep: stepOption]
 * [x] purchase: [handlePurchase: purchaseId]
 * [x] refund: [handlePurchase: refundId]
 *
 * View ->
 * Product: impressions
 * Promotion: promotions
 * detail: detailProducts
 * checkout: [handleStep: stepNo]
 * checkout_option: [handleStep: stepOption]
 * purchase: [handlePurchase: purchaseId]
 * refund: [handlePurchase: refundId]
 *
 * fromP (list) ->
 * detail
 *
 * p (list) ->
 * impressions,
 * ClickProduct
 */

import get from "get-object-value";
import set from "set-object-value";
import callfunc from "call-func";
import { KEYS, UNDEFINED } from "reshow-constant";

import shopify from "../actions/shopify";

const CURRENCY_CODE = "currencyCode";
const setCurrency = (I13N, ecommerce, defaultCurrencyCode) => {
  const currencyCode = get(I13N, [CURRENCY_CODE]) || defaultCurrencyCode;
  set(ecommerce, [CURRENCY_CODE], currencyCode);
};

const stepSend = {};
const handleStep = (I13N, ecommerce, defaultCurrencyCode) => {
  const { stepNo, stepOption, products } = I13N;
  const step = stepNo ?? shopify.getStepNo();
  const option = stepOption ?? shopify.getStepName();
  if (!step) {
    return;
  }
  const actionField = { step, option };
  if (!stepSend[step] || (products && products.length) || !option) {
    stepSend[step] = {
      actionField,
      products,
    };
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    set(ecommerce, ["checkout"], stepSend[step]);
  } else {
    set(ecommerce, ["checkout_option"], { actionField });
  }
};

const handlePromotionImpressions = (I13N, ecommerce) => {
  const { promotions } = I13N;
  if (promotions) {
    set(ecommerce, ["promoView", "promotions"], promotions);
  }
};

const handleDetailProducts = (I13N, ecommerce, defaultCurrencyCode) => {
  const { fromP, detailProducts } = I13N;
  if (detailProducts) {
    if (fromP) {
      set(ecommerce, ["detail", "actionField", "list"], fromP);
    }
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    set(ecommerce, ["detail", "products"], detailProducts);
  }
};

const handleImpressions = (I13N, ecommerce, defaultCurrencyCode) => {
  const { p, impressions } = I13N;
  if (impressions) {
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    if (p) {
      impressions.forEach(
        (item, index) => (impressions[index].list = item.list || p)
      );
    }
    set(ecommerce, ["impressions"], impressions);
  }
};

const handlePurchase = (I13N, ecommerce, defaultCurrencyCode, value) => {
  const { purchaseId, refundId, products } = I13N;
  const affiliation = get(I13N, ["affiliation"], "");
  const coupon = get(I13N, ["coupon"], "");
  const revenue = get(I13N, ["revenue"], 0);
  value = revenue;
  const tax = get(I13N, ["tax"], 0);
  const shipping = get(I13N, ["shipping"], 0);
  if (purchaseId) {
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    set(ecommerce, ["purchase", "actionField"], {
      id: purchaseId,
      affiliation,
      revenue,
      tax,
      shipping,
      coupon,
    });
    set(ecommerce, ["purchase", "products"], products);
  }
  if (refundId) {
    set(ecommerce, ["refund", "actionField", "id"], refundId);
    if (products) {
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      set(ecommerce, ["refund", "products"], products);
    }
  }
};

const getActionEcommerce = (I13N, { defaultCurrencyCode }) => {
  const { p, action, products, promotions } = I13N;
  const ecommerce = {};
  let value;
  let actionField;
  if (p) {
    actionField = { list: p };
  }
  const actionAndProduct = {
    //need put after actionField
    actionField,
    products,
  };
  switch (action) {
    case "ClickPromotion":
      ecommerce.promoClick = { promotions };
      break;
    case "ClickProduct":
      ecommerce.click = actionAndProduct;
      value = get(products, [0, "price"]);
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      break;
    case "BuyNow":
    case "AddToCart":
      ecommerce.add = actionAndProduct;
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      break;
    case "RemoveFromCart":
      ecommerce.remove = actionAndProduct;
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      break;
    case "ViewContent":
      handlePromotionImpressions(I13N, ecommerce);
      handleDetailProducts(I13N, ecommerce, defaultCurrencyCode);
      handleImpressions(I13N, ecommerce, defaultCurrencyCode);
      break;
  }

  handleStep(I13N, ecommerce, defaultCurrencyCode);
  handlePurchase(I13N, ecommerce, defaultCurrencyCode, value);
  return { ecommerce, value };
};

const getImpressionEcommerce = (I13N, { defaultCurrencyCode }) => {
  const ecommerce = {};
  handlePromotionImpressions(I13N, ecommerce);
  handleDetailProducts(I13N, ecommerce, defaultCurrencyCode);
  handleImpressions(I13N, ecommerce, defaultCurrencyCode);
  handlePurchase(I13N, ecommerce, defaultCurrencyCode);
  handleStep(I13N, ecommerce, defaultCurrencyCode);
  return { ecommerce };
};

/**
 * @see getActionEcommerce
 * @see getImpressionEcommerce
 */
const handleEcommerce = (beaconOption, I13N, store) => {
  const state = store.getState();
  const { ecommerce, value } = callfunc(
    beaconOption.trigger === "action"
      ? getActionEcommerce
      : getImpressionEcommerce,
    [I13N, { defaultCurrencyCode: state.get("currencyCode") }]
  );
  if (KEYS(ecommerce).length) {
    beaconOption.ecommerce = ecommerce;
    if (beaconOption.trigger === "action") {
      beaconOption.category = "Ecommerce";
      if (UNDEFINED === typeof beaconOption.value && !isNaN(value)) {
        beaconOption.value = value;
      }
    }
  }
  return beaconOption;
};

export default handleEcommerce;
