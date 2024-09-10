//@ts-check

import callfunc from "call-func";
import { removeEmpty } from "array.merge";
import { KEYS } from "reshow-constant";
import { UNDEFINED } from "reshow-constant";
import { getNum } from "to-percent-js";
const DIMENSION = "dimension";
const METRIC = "metric";
const isArray = (/**@type any*/ a) => a && Array.isArray(a) && a.length;


/**
 * @param {number=} v
 */
const notUndefinedNum = (v) => (UNDEFINED !== typeof v ? getNum(v) : v);

export const getEcImpressionsData = (impressions, config) => {
  if (isArray(impressions)) {
    let listLen = 1;
    const aList = {};
    const data = {};
    impressions.forEach(({ list, ...prod }) => {
      if (!aList[list]) {
        aList[list] = {
          key: "il" + listLen,
          n: 1,
        };
        listLen++;
        data[aList[list].key + "nm"] = list;
      }
      const key = aList[list].key + "pi" + aList[list].n;
      aList[list].n++;
      setOneProduct(key, data, prod, config);
    });
    return data;
  }
};

export const getEcStepData = (checkout, checkout_option, config) => {
  if (checkout || checkout_option) {
    const { actionField, products } = checkout || checkout_option;
    const { step, option } = actionField || {};
    const data = {
      cos: step,
      col: option,
      pa: checkout_option ? "checkout_option" : "checkout",
      ...getProductsData(products, config),
    };
    return data;
  }
};

export const getItemsData = (items, itemKey, itemCb, config) => {
  if (isArray(items)) {
    let sn = 1;
    const data = {};
    items.forEach((item) => {
      if (!item) {
        return;
      }
      const key = itemKey + sn;
      sn++;
      callfunc(itemCb, [key, data, item, config]);
    });
    return data;
  }
};

const getPromotionsData = (promotions) =>
  getItemsData(promotions, "promo", setOnePromotion);

export const getEcPromotionData = (promoView, promoClick) => {
  if (promoView || promoClick) {
    let action;
    const { promotions } = promoView || promoClick;
    if (promoView) {
      action = "view";
    } else {
      action = "click";
    }
    const data = {
      promoa: action,
      ...getPromotionsData(promotions),
    };
    return data;
  }
};

export const setOnePromotion = (key, data, item) => {
  const { id, name, creative, position } = item;
  data[key + "id"] = id;
  data[key + "nm"] = name;
  data[key + "cr"] = creative;
  data[key + "ps"] = notUndefinedNum(position);
};

const getProductsData = (products, config) =>
  getItemsData(products, "pr", setOneProduct, config);

export const setOneProduct = (key, data, item, config) => {
  const {
    id,
    name,
    category,
    brand,
    variant,
    position,
    price,
    quantity,
    coupon,
    image,
    sku,
    ...others
  } = item;
  if (id == null && name == null) {
    return;
  }
  data[key + "id"] = id;
  data[key + "nm"] = name;
  data[key + "br"] = brand;
  data[key + "ca"] = category;
  data[key + "va"] = variant;
  data[key + "pr"] = notUndefinedNum(price);
  data[key + "qt"] = quantity;
  data[key + "cc"] = coupon;
  data[key + "ps"] = notUndefinedNum(position);
  data[key + "img"] = image;
  data[key + "sku"] = sku;
  KEYS(others).forEach((k) => {
    let endKey;
    if (0 === k.indexOf(DIMENSION)) {
      endKey = "cd";
    }
    if (0 === k.indexOf(METRIC)) {
      endKey = "cm";
    }
    if (endKey) {
      const sn = getNum(k);
      data[key + endKey + sn] = others[k];
    }
  });
  const { imageIndex } = config || {};
  if (imageIndex) {
    data[key + "cd" + config.imageIndex] = image;
  }
};

export const getEcPurchaseData = (purchase, refund, config) => {
  if (purchase || refund) {
    const { actionField, products } = purchase || refund;
    const { id, affiliation, revenue, tax, shipping, coupon } =
      actionField || {};
    let data;
    if (purchase) {
      data = {
        pa: "purchase",
        ti: id,
        ta: affiliation,
        tr: notUndefinedNum(revenue),
        tt: notUndefinedNum(tax),
        ts: notUndefinedNum(shipping),
        tcc: coupon,
      };
    } else {
      data = {
        pa: "refund",
        ti: id,
      };
    }
    if (products) {
      data = {
        ...data,
        ...getProductsData(products, config),
      };
    }
    return data;
  }
};

export const getEcActionData = (options, action, config) => {
  if (options) {
    const { actionField, products } = options;
    const { list } = actionField || {};
    const data = {
      ...getProductsData(products, config),
      pa: action,
      pal: list,
    };
    // use removeEmtpy to clean non-use pa
    return removeEmpty(data, true);
  }
};

export const getEcData = (config) => {
  const { ecommerce } = config || {};
  if (ecommerce) {
    const {
      impressions,
      detail,
      click,
      add,
      remove,
      checkout,
      checkout_option,
      purchase,
      refund,
      promoView,
      promoClick,
      currencyCode,
    } = ecommerce;
    const data = {
      ...getEcImpressionsData(impressions, config),
      ...getEcActionData(detail, "detail", config),
      ...getEcActionData(click, "click", config),
      ...getEcActionData(add, "add", config),
      ...getEcActionData(remove, "remove", config),
      ...getEcStepData(checkout, checkout_option, config),
      ...getEcPurchaseData(purchase, refund, config),
      ...getEcPromotionData(promoView, promoClick),
      cu: currencyCode,
    };
    return data;
  }
};
