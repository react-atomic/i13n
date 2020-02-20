import {win, doc} from 'win-doc';
import get from 'get-object-value';
import getCookie, {setCookie} from 'get-cookie';
import getRandomId from 'get-random-id';
import {removeEmpty} from 'array.merge';
import {toNum, getNum} from 'to-percent-js';
import callfunc from 'call-func';
import {UNDEFINED} from 'reshow-constant';

import getTimestamp from './getTimestamp';
import parseJson from './parseJson';

let seq = 1;
const DIMENSION = 'dimension';
const METRIC = 'metric';
const X = 'x';
const MP_CLIENT_ID = '_ga';
const isArray = a => a && Array.isArray(a) && a.length;
const keys = Object.keys;
const pvid = getRandomId();
const notUndefinedNum = v => (UNDEFINED !== typeof v ? toNum(v) : v);

class DataLayerToMp {
  getClientIdCookie(key) {
    const cookies = (getCookie(key || '') || '').split('.');
    if (cookies[2] && cookies[3]) {
      return cookies[2] + '.' + cookies[3];
    }
  }

  getClientId() {
    let c = this.getClientIdCookie(MP_CLIENT_ID);
    if (!c) {
      c = getRandomId();
      setCookie(MP_CLIENT_ID, 'GA1.3.' + c, 365 * 2);
    }
    return c;
  }

  isSameHost = hostName => test => {
    const thisHost = '//' + hostName;
    const i = test.indexOf(thisHost);
    if (5 === i || 6 === i) {
      const check = test.charAt(i + thisHost.length);
      if ('/' === check || '?' === check || '' === check || ':' === check) {
        return true;
      }
    }
    return false;
  };

  getReferrer(oDoc) {
    if (!oDoc) {
      oDoc = doc();
    }
    const hostname = get(oDoc, ['location', 'hostname']);
    const referrer = get(oDoc, ['referrer']);
    if (referrer && !this.isSameHost(hostname)(referrer)) {
      return {
        dr: referrer,
      };
    }
  }

  getActionData(config) {
    const {action, category, label, value} = config || {};
    const data = {
      ec: category,
      ea: action,
      el: label,
      ev: notUndefinedNum(value),
    };
    return data;
  }

  getItemsData(items, itemKey, itemCb) {
    if (isArray(items)) {
      let sn = 1;
      const data = {};
      items.forEach(item => {
        if (!item) {
          return;
        }
        const key = itemKey + sn;
        sn++;
        callfunc(itemCb, [key, data, item]);
      });
      return data;
    }
  }

  getPromotionsData = promotions =>
    this.getItemsData(promotions, 'promo', this.setOnePromotion);

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

  setOnePromotion = (key, data, item) => {
    const {id, name, creative, position} = item;
    data[key + 'id'] = id;
    data[key + 'nm'] = name;
    data[key + 'cr'] = creative;
    data[key + 'ps'] = notUndefinedNum(position);
  };

  getProductsData = products =>
    this.getItemsData(products, 'pr', this.setOneProduct);

  setOneProduct(key, data, item) {
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
      ...others
    } = item;
    data[key + 'id'] = id;
    data[key + 'nm'] = name;
    data[key + 'br'] = brand;
    data[key + 'ca'] = category;
    data[key + 'va'] = variant;
    data[key + 'pr'] = price;
    data[key + 'qt'] = quantity;
    data[key + 'cc'] = coupon;
    data[key + 'ps'] = notUndefinedNum(position);
    keys(others).forEach(k => {
      let endKey;
      if (0 === k.indexOf(DIMENSION)) {
        endKey = 'cd';
      }
      if (0 === k.indexOf(METRIC)) {
        endKey = 'cm';
      }
      if (endKey) {
        const sn = getNum(k);
        data[key + endKey + sn] = others[k];
      }
    });
  }

  getEcPurchaseData(purchase, refund) {
    if (purchase || refund) {
      const {actionField, products} = purchase || refund;
      const {id, affiliation, revenue, tax, shipping, coupon} =
        actionField || {};
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
      const {step, option} = actionField || {};
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
      const {list} = actionField || {};
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
    const {ecommerce} = config || {};
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

  getMp(props, data) {
    const oDoc = doc();
    const oWin = win();
    const nav = oWin.navigator || {};
    const screen = oWin.screen || {};
    const docEl = oDoc.documentElement || {};
    const vw = Math.max(docEl.clientWidth || 0, oWin.innerWidth || 0);
    const vh = Math.max(docEl.clientHeight || 0, oWin.innerHeight || 0);
    const {tagId} = props || {};
    const {
      event: ev,
      bCookieIndex,
      bCookie,
      lazeInfoIndex,
      lazeInfo,
      expId,
      expVar,
      p,
      p2,
      p3,
      p4,
      p5,
    } = data || {};
    const d = {
      ...this.getActionData(data),
      ...this.getEcData(data),
      ...this.getReferrer(),
      xid: expId,
      xvar: expVar,
      cg1: p,
      cg2: p2,
      cg3: p3,
      cg4: p4,
      cg5: p5,
      _s: seq,
      dl: oDoc.URL,
      ul: (nav.language || nav.browserLanguage || '').toLowerCase(),
      de: oDoc.characterSet || oDoc.charset,
      dt: oDoc.title,
      sd: screen.colorDepth + '-bit',
      sr: screen.width + X + screen.height,
      vp: vw + X + vh,
      je: toNum(callfunc(nav.javaEnabled, null, nav)),
      tid: tagId,
      cid: this.getClientId(),
      _gid: this.getClientIdCookie('_gid'),
      v: 1, //version
      z: getRandomId(),
      a: pvid,
    };
    seq++;
    d.t =
      -1 !== (ev || '').toLowerCase().indexOf('view') ? 'pageview' : 'event';
    if (bCookie) {
      if (bCookieIndex) {
        d['cd' + bCookieIndex] = bCookie;
      }
      d.uid = bCookie;
    }
    if (lazeInfo) {
      if (lazeInfoIndex) {
        d['cd' + lazeInfoIndex] = lazeInfo;
      }
      const oLazyInfo = parseJson(lazeInfo);
      if (oLazyInfo.time) {
        const past = getTimestamp(oLazyInfo.time);
        if (!isNaN(past)) {
          d.qt = getTimestamp() - past;
        }
      }
    }
    return removeEmpty(d, true);
  }
}

export default DataLayerToMp;
export {MP_CLIENT_ID};
