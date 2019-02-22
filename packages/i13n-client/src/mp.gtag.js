import {win, doc} from 'win-doc';
import get from 'get-object-value';
import getCookie from 'get-cookie';
import {localStorage, Storage} from 'get-storage';
import getRandomId from 'get-random-id';
import {removeEmpty} from 'array.merge';
import {toNum} from 'to-percent-js';

import BaseGTag from './BaseGTag';
import {beacon} from './req';

let seq = 1;
const X = 'x';
const MP_CLIENT_ID = 'mpClientId';
const lStore = new Storage(localStorage);
const isArray = a => a && Array.isArray(a) && a.length;

class MpGTag extends BaseGTag {
  getHost() {
    const {mpHost, defaultMpHost} = this.props;
    let host = mpHost || defaultMpHost;
    host += '/collect';
    return host;
  }

  getClientId() {
    const c =
      getCookie('clientID') || lStore.get(MP_CLIENT_ID) || getRandomId();
    lStore.set(MP_CLIENT_ID, c);
    return c;
  }

  getActionData(config) {
    const {action, category, label, value} = get(config, null, {});
    const data = {
      ec: category,
      ea: action,
      el: label,
      ev: toNum(value),
    };
    return data;
  }

  getEcPromotionData(promoView, promoClick) {
    if (promoView || promoClick) {
      let action;
      const {promotions} = promoView || promoClick;
      if (promoView) {
        action = 'view';
      } else {
        action = 'click';
      }
      const data = {
        promoa: action,
        ...this.getPromotionsData(promotions),
      };
      return data;
    }
  }

  getItemsData(items, itemKey, itemCb) {
    if (isArray(items)) {
      let sn = 1;
      const data = {};
      items.forEach(item => {
        const key = itemKey + sn;
        sn++;
        itemCb(key, data, item);
      });
      return data;
    }
  }

  getPromotionsData = promotions =>
    this.getItemsData(promotions, 'promo', this.setOnePromotion);

  setOnePromotion = (key, data, item) => {
    const {id, name, creative, position} = item;
    data[key + 'id'] = id;
    data[key + 'nm'] = name;
    data[key + 'cr'] = creative;
    data[key + 'ps'] = position;
  };

  getProductsData = products =>
    this.getItemsData(products, 'pr', this.setOneProduct);

  setOneProduct(key, data, item) {
    const {id, name, category, brand, variant, position, price} = item;
    data[key + 'id'] = id;
    data[key + 'nm'] = name;
    data[key + 'ca'] = category;
    data[key + 'br'] = brand;
    data[key + 'va'] = variant;
    data[key + 'ps'] = position;
    data[key + 'pr'] = price;
  }

  getEcPurchaseData(purchase, refund) {
    if (purchase || refund) {
      const {actionField, products} = purchase || refund;
      const {id, affiliation, revenue, tax, shipping, coupon} = get(
        actionField,
        null,
        {},
      );
      let data;
      if (purchase) {
        data = {
          pa: 'purchase',
          ti: id,
          ta: affiliation,
          tr: revenue,
          tt: tax,
          ts: shipping,
          tcc: coupon,
        };
      } else {
        data = {
          pa: 'refund',
          ti: id,
        };
      }
      if (products) {
        data = {
          ...data,
          ...this.getProductsData(products),
        };
      }
      return data;
    }
  }

  getEcStepData(checkout, checkout_option) {
    if (checkout || checkout_option) {
      const {actionField, products} = checkout || checkout_option;
      const {step, option} = get(actionField, null, {});
      const data = {
        cos: step,
        col: option,
        pa: checkout_option ? 'checkout_option' : 'checkout',
        ...this.getProductsData(products),
      };
      return data;
    }
  }

  getEcActionData(config, action) {
    if (config) {
      const {actionField, products} = config;
      const {list} = get(actionField, null, {});
      const data = {
        ...this.getProductsData(products),
        pa: action,
        pal: list,
      };
      // use removeEmtpy to clean non-use pa
      return removeEmpty(data, true);
    }
  }

  getEcImpressionsData(impressions) {
    if (isArray(impressions)) {
      let listLen = 1;
      const aList = {};
      const data = {};
      impressions.forEach(({list, ...prod}) => {
        if (!aList[list]) {
          aList[list] = {
            key: 'il' + listLen,
            n: 1,
          };
          listLen++;
          data[aList[list].key + 'nm'] = list;
        }
        const key = aList[list].key + 'pi' + aList[list].n;
        aList[list].n++;
        this.setOneProduct(key, data, prod);
      });
      return data;
    }
  }

  getEcData(config) {
    const {ecommerce} = get(config, null, {});
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
        ...this.getEcImpressionsData(impressions),
        ...this.getEcActionData(detail, 'detail'),
        ...this.getEcActionData(click, 'click'),
        ...this.getEcActionData(add, 'add'),
        ...this.getEcActionData(remove, 'remove'),
        ...this.getEcStepData(checkout, checkout_option),
        ...this.getEcPurchaseData(purchase, refund),
        ...this.getEcPromotionData(promoView, promoClick),
        cu: currencyCode,
      };
      return data;
    }
  }

  push(config) {
    const host = this.getHost();
    const oDoc = get(doc(), null, {});
    const oWin = get(win(), null, {});
    const nav = get(oWin, ['navigator'], {});
    const screen = get(oWin, ['screen'], {});
    const docEl = get(oDoc, ['documentElement'], {});
    const vw = Math.max(docEl.clientWidth || 0, oWin.innerWidth || 0);
    const vh = Math.max(docEl.clientHeight || 0, oWin.innerHeight || 0);
    const {tagId} = this.props;
    const d = {
      ...this.getActionData(config),
      ...this.getEcData(config),
      _s: seq,
      dl: oDoc.URL,
      ul: (nav.language || nav.browserLanguage || '').toLowerCase(),
      de: oDoc.characterSet || oDoc.charset,
      dt: oDoc.title,
      sd: screen.colorDepth + '-bit',
      sr: screen.width + X + screen.height,
      vp: vw + X + vh,
      je: ('function' === typeof nav.javaEnabled && nav.javaEnabled()) || false,
      tid: tagId,
      cid: this.getClientId(),
      v: 1, //version
      z: getRandomId(),
    };
    const {event: ev, bCookieIndex, bCookie, lazeInfoIndex, lazeInfo} = get(
      config,
      null,
      {},
    );
    d.t = -1 !== (ev || '').toLowerCase().indexOf('view') ? 'pageview' : 'event';
    if (bCookieIndex) {
      d['cd' + bCookieIndex] = bCookie;
    }
    if (lazeInfoIndex) {
      d['cd' + lazeInfoIndex] = lazeInfo;
    }

    // console.log([this.props, config, host, d]);
    beacon(host, removeEmpty(d, true));
    seq++;
  }
}

export default MpGTag;
