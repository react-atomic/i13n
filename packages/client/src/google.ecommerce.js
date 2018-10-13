/**
 * Actions ->
 * click: ClickProduct
 * [x] detail: [view]
 * add: AddToCart
 * remove: RemoveFromCart
 * checkout: Checkout
 * checkout_option: CheckoutOption
 * purchase: Purchase | [view]
 * refund: Refund | [view]
 * promo_click: ClickPromotion
 *
 * View ->
 * Product: impressions
 * Promotion: promotions
 * detail: detailProducts
 * purchase: purchaseId
 * refund: refundId
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
  const {p, action, products, promotions, stepNo, stepOption} = I13N;
  let ecommerce = {};
  switch (action) {
    case 'Checkout':
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      ecommerce = {
        checkout: {
          products,
          actionField: {
            step: stepNo,
            option: stepOption,
          },
        },
      };
      break;
    case 'CheckoutOption':
      ecommerce = {
        checkout_option: {
          actionField: {
            step: stepNo,
            option: stepOption,
          },
        },
      };
      break;
    case 'ClickPromotion':
      ecommerce = {
        promoClick: {promotions},
      };
      break;
    case 'ClickProduct':
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      ecommerce = {
        click: {
          products,
          actionField: {
            list: p,
          },
        },
      };
      break;
    case 'AddToCart':
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      ecommerce = {add: {products}};
      break;
    case 'RemoveFromCart':
      setCurrency(I13N, ecommerce, defaultCurrencyCode);
      ecommerce = {remove: {products}};
      break;
    case 'Purchase':
      ecommerce = handlePurchase(I13N, ecommerce, defaultCurrencyCode);
      break;
    case 'Refund':
      ecommerce = handlePurchase(I13N, ecommerce, defaultCurrencyCode);
      break;
  }
  return ecommerce;
};

const getViewEcommerce = (I13N, defaultCurrencyCode) => {
  const {p, fromP, impressions, detailProducts, promotions} = I13N;
  let ecommerce = {};
  if (impressions) {
    setCurrency(I13N, ecommerce, defaultCurrencyCode);
    if (p) {
      impressions.forEach(item => (item.list = p));
    }
    set(ecommerce, ['impressions'], impressions);
  }
  if (detailProducts) {
    if (fromP) {
      set(ecommerce, ['detail', 'actionField', 'list'], fromP);
    }
    set(ecommerce, ['detail', 'products'], detailProducts);
  }
  if (promotions) {
    set(ecommerce, ['promoView', 'promotions'], promotions);
  }
  ecommerce = handlePurchase(I13N, ecommerce, defaultCurrencyCode);
  return ecommerce;
};

const CURRENCY_CODE = 'currencyCode';
const setCurrency = (I13N, ecommerce, defaultCurrencyCode) => {
  const currencyCode = get(I13N, [CURRENCY_CODE], defaultCurrencyCode);
  if (currencyCode) {
    set(ecommerce, [CURRENCY_CODE], thisCurrencyCode);
  }
};

const handlePurchase = (I13N, ecommerce, defaultCurrencyCode) => {
  const {purchaseId, refundId, products} = I13N;
  const affiliation = get(I13N, ['affiliation'], '');
  const coupon = get(I13N, ['coupon'], '');
  const revenue = get(I13N, ['revenue'], 0);
  const tax = get(I13N, ['tax'], 0);
  const shipping = get(I13N, ['shipping'], 0);
  setCurrency(I13N, ecommerce, defaultCurrencyCode);
  if (purchaseId) {
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
      set(ecommerce, ['refund', 'products'], products);
    }
  }
  return ecommerce;
};

export {getViewEcommerce, getActionEcommerce};