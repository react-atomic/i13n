// @ts-check
import { removeEmpty } from "array.merge";
import { getNum } from "to-percent-js";
import callfunc from "call-func";
import { UNDEFINED, KEYS } from "reshow-constant";
import getRandomId, { getTimestamp } from "get-random-id";

// lib
import parseJson from "../libs/parseJson";
import { ERROR_CATEGORY } from "../libs/logError";

// action
import getStartTime from "../actions/startTime";
import getClientId from "../actions/getClientId";

const DIMENSION = "dimension";
const METRIC = "metric";
const isArray = (/**@type any*/ a) => a && Array.isArray(a) && a.length;
/**
 * @param {number=} v
 */
const notUndefinedNum = (v) => (UNDEFINED !== typeof v ? getNum(v) : v);

class DataLayerToMp {
  /**
   * @param {object} config
   */
  getActionData(config) {
    const { action, category, label, value } = config || {};
    const data = {
      ec: category,
      ea: action,
      el: label,
      ev: notUndefinedNum(value),
    };
    return data;
  }

  getItemsData(items, itemKey, itemCb, config) {
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
  }

  getPromotionsData = (promotions) =>
    this.getItemsData(promotions, "promo", this.setOnePromotion);

  getEcPromotionData(promoView, promoClick) {
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
        ...this.getPromotionsData(promotions),
      };
      return data;
    }
  }

  setOnePromotion = (key, data, item) => {
    const { id, name, creative, position } = item;
    data[key + "id"] = id;
    data[key + "nm"] = name;
    data[key + "cr"] = creative;
    data[key + "ps"] = notUndefinedNum(position);
  };

  getProductsData = (products, config) =>
    this.getItemsData(products, "pr", this.setOneProduct, config);

  setOneProduct(key, data, item, config) {
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
  }

  getEcPurchaseData(purchase, refund, config) {
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
          ...this.getProductsData(products, config),
        };
      }
      return data;
    }
  }

  getEcStepData(checkout, checkout_option, config) {
    if (checkout || checkout_option) {
      const { actionField, products } = checkout || checkout_option;
      const { step, option } = actionField || {};
      const data = {
        cos: step,
        col: option,
        pa: checkout_option ? "checkout_option" : "checkout",
        ...this.getProductsData(products, config),
      };
      return data;
    }
  }

  getEcActionData(options, action, config) {
    if (options) {
      const { actionField, products } = options;
      const { list } = actionField || {};
      const data = {
        ...this.getProductsData(products, config),
        pa: action,
        pal: list,
      };
      // use removeEmtpy to clean non-use pa
      return removeEmpty(data, true);
    }
  }

  getEcImpressionsData(impressions, config) {
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
        this.setOneProduct(key, data, prod, config);
      });
      return data;
    }
  }

  getEcData(config) {
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
        ...this.getEcImpressionsData(impressions, config),
        ...this.getEcActionData(detail, "detail", config),
        ...this.getEcActionData(click, "click", config),
        ...this.getEcActionData(add, "add", config),
        ...this.getEcActionData(remove, "remove", config),
        ...this.getEcStepData(checkout, checkout_option, config),
        ...this.getEcPurchaseData(purchase, refund, config),
        ...this.getEcPromotionData(promoView, promoClick),
        cu: currencyCode,
      };
      return data;
    }
  }

  getMp(props, data) {
    const { trackingId, needTrackingId, version } = props || {};
    if (needTrackingId && trackingId == null) {
      return false;
    }
    const {
      trigger,
      bCookieIndex,
      bCookie,
      lazeInfoIndex,
      lazeInfo,
      p,
      p2,
      p3,
      p4,
      p5,
    } = data || {};
    const d = {
      ...this.getActionData(data),
      ...this.getEcData(data),
      cg1: p,
      cg2: p2,
      cg3: p3,
      cg4: p4,
      cg5: p5,
      // <-- GA4 Ready -->
      _s: seq,
      tid: trackingId,
      cid: getClientId(),
      v: version || 2, //version
      sid: pvid,
      seg: 1,
      // <-- GBA TEST -->
      _dbg: 1,
      uid: "xxx",
      "up.role": "test",
      _uip: "223.136.1.1",
      _uc: "TW",
      en: "impression" === trigger ? "page_view" : "event",
    };
    seq++;
    if (ERROR_CATEGORY === d.ec) {
      d.t = "exception";
      d.exd = d.ea;
    }
    if (bCookie) {
      if (bCookieIndex) {
        d["cd" + bCookieIndex] = bCookie;
      }
      d.uid = bCookie;
    }
    if (lazeInfo) {
      if (lazeInfoIndex) {
        d["cd" + lazeInfoIndex] = lazeInfo;
      }
      const oLazyInfo = parseJson(lazeInfo);
      if (oLazyInfo.time) {
        const past = getTimestamp(oLazyInfo.time);
        if (!isNaN(past)) {
          d.qt = getTimestamp() - past;
        }
      }
    }
    const startTime = getStartTime();
    if (startTime) {
      d.tfd = getTimestamp() - startTime;
    }
    return removeEmpty(d, true);
  }
}

let seq;
let pvid;
/**
 * @param {number} i
 */
export const resetSeq = (i = 1) => {
  seq = i;
  pvid = getRandomId();
};
resetSeq();

export default DataLayerToMp;
