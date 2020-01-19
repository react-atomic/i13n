/**
 * Actions ->
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#action-types
 *
 * click: ClickProduct
 * add: AddToCart
 * remove: RemoveFromCart
 * promo_click: ClickPromotion
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

import get from 'get-object-value';
import set from 'set-object-value';

const getActionEcommerce = (I13N, defaultCurrencyCode) => {
  const {p, action, products, promotions} = I13N;
  let ecommerce = {};
  let value;
  let actionField;
  if (p) {
    actionField = {list: p};
  }
  switch (action) {
    case 'ClickPromotion':
      ecommerce = {promoClick: {promotions}};
      break;
    case 'ClickProduct':
      ecommerce = {click: {actionField, products}};
      value = get(products, [0, 'price']);
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      break;
    case 'AddToCart':
      ecommerce = {add: {actionField, products}};
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      break;
    case 'RemoveFromCart':
      ecommerce = {remove: {actionField, products}};
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      break;
  }

  handleStep(I13N, ecommerce, defaultCurrencyCode);
  handlePurchase(I13N, ecommerce, defaultCurrencyCode, value);
  return {ecommerce, value};
};

const getViewEcommerce = (I13N, defaultCurrencyCode) => {
  const {p, fromP, impressions, detailProducts, promotions} = I13N;
  const ecommerce = {};
  if (impressions) {
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    if (p) {
      impressions.forEach(item => (item.list = item.list || p));
    }
    set(ecommerce, ['impressions'], impressions);
  }
  if (detailProducts) {
    if (fromP) {
      set(ecommerce, ['detail', 'actionField', 'list'], fromP);
    }
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    set(ecommerce, ['detail', 'products'], detailProducts);
  }
  if (promotions) {
    set(ecommerce, ['promoView', 'promotions'], promotions);
  }
  handlePurchase(I13N, ecommerce, defaultCurrencyCode);
  handleStep(I13N, ecommerce, defaultCurrencyCode);
  return ecommerce;
};

const CURRENCY_CODE = 'currencyCode';
const setCurrency = (I13N, ecommerce, defaultCurrencyCode) => {
  const currencyCode = get(I13N, [CURRENCY_CODE]) || defaultCurrencyCode;
  set(ecommerce, [CURRENCY_CODE], currencyCode);
};

const stepSend = {};
const handleStep = (I13N, ecommerce, defaultCurrencyCode) => {
  const {stepNo: step, stepOption: option, products} = I13N;
  if (!step) {
    return;
  }
  const actionField = {step, option};
  if (!stepSend[step] || (products && products.length) || !option) {
    stepSend[step] = {
      actionField,
      products,
    };
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    set(ecommerce, ['checkout'], stepSend[step]);
  } else {
    set(ecommerce, ['checkout_option'], {actionField});
  }
};

const handlePurchase = (I13N, ecommerce, defaultCurrencyCode, value) => {
  const {purchaseId, refundId, products} = I13N;
  const affiliation = get(I13N, ['affiliation'], '');
  const coupon = get(I13N, ['coupon'], '');
  const revenue = get(I13N, ['revenue'], 0);
  value = revenue;
  const tax = get(I13N, ['tax'], 0);
  const shipping = get(I13N, ['shipping'], 0);
  if (purchaseId) {
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    set(ecommerce, ['purchase', 'actionField'], {
      id: purchaseId,
      affiliation,
      revenue,
      tax,
      shipping,
      coupon,
    });
    set(ecommerce, ['purchase', 'products'], products);
  }
  if (refundId) {
    set(ecommerce, ['refund', 'actionField', 'id'], refundId);
    if (products) {
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      set(ecommerce, ['refund', 'products'], products);
    }
  }
};

export {getViewEcommerce, getActionEcommerce};
