import {win, doc} from 'win-doc';
import get from 'get-object-value';
import getCookie, {setCookie} from 'get-cookie';
import getRandomId from 'get-random-id';
import {removeEmpty} from 'array.merge';
import {toNum, getNum} from 'to-percent-js';

let seq = 1;
const DIMENSION = 'dimension';
const METRIC = 'metric';
const X = 'x';
const MP_CLIENT_ID = '_ga';
const isArray = a => a && Array.isArray(a) && a.length;
const keys = Object.keys;
const pvid = getRandomId();

class DataLayerToMp {
  getClientIdCookie = () => getCookie(MP_CLIENT_ID) || '';

  getClientId() {
    const cookies = this.getClientIdCookie().split('.');
    let c;
    if (cookies[2] && cookies[3]) {
      c = cookies[2] + '.' + cookies[3];
    } else {
      c = getRandomId();
      setCookie(MP_CLIENT_ID, 'GA1.2.' + c, 365 * 2);
    }
    return c;
  }

  isSameHost = hostName => test => {
    const thisHost = '//'+hostName;
    const i = test.indexOf(thisHost);
    if (5 === i || 6 === i) {
      const check = test.charAt(i + thisHost.length);
      if ('/' === check || '?' === check || '' === check || ':' === check) {
        return true;
      }
    }
    return false;
  }

  getReferrer(oDoc) {
    if (!oDoc) {
      oDoc = doc();
    }
    const hostname = get(oDoc, ['location', 'hostname']);
    const referrer = get(oDoc, ['referrer']);
    if (referrer && !this.isSameHost(hostname)(referrer)) {
      return {
        dr: referrer 
      }
    }
  }

  getActionData(config) {
    const {action, category, label, value} = get(config, null, {});
    const data = {
      ec: category,
      ea: action,
      el: label,
      ev: 'undefined' !== typeof value ? toNum(value) : value,
    };
    return data;
  }

  getItemsData(items, itemKey, itemCb) {
    if (isArray(items)) {
      let sn = 1;
      const data = {};
      items.forEach(item => {
        const key = itemKey + sn;
        sn++;
        if ('fuction' === typeof itemCb) {
          itemCb(key, data, item);
        }
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
    data[key + 'ps'] = position;
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
      ...others
    } = item;
    data[key + 'id'] = id;
    data[key + 'nm'] = name;
    data[key + 'ca'] = category;
    data[key + 'br'] = brand;
    data[key + 'va'] = variant;
    data[key + 'ps'] = position;
    data[key + 'pr'] = price;
    keys(others).forEach(k => {
      let endKey;
      if (0 === k.indexOf(DIMENSION)) {
        endKey = 'cd';
      }
      if (0 === k.indexOf(METRIC)) {
        endKey = 'cm';
      }
      const sn = getNum(k);
      data[key + endKey + sn] = others[k];
    });
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

  getMp(props, data) {
    const oDoc = get(doc(), null, {});
    const oWin = get(win(), null, {});
    const nav = get(oWin, ['navigator'], {});
    const screen = get(oWin, ['screen'], {});
    const docEl = get(oDoc, ['documentElement'], {});
    const vw = Math.max(docEl.clientWidth || 0, oWin.innerWidth || 0);
    const vh = Math.max(docEl.clientHeight || 0, oWin.innerHeight || 0);
    const {tagId} = props || {};
    const d = {
      ...this.getActionData(data),
      ...this.getEcData(data),
      ...this.getReferrer(),
      _s: seq,
      dl: oDoc.URL,
      ul: (nav.language || nav.browserLanguage || '').toLowerCase(),
      de: oDoc.characterSet || oDoc.charset,
      dt: oDoc.title,
      sd: screen.colorDepth + '-bit',
      sr: screen.width + X + screen.height,
      vp: vw + X + vh,
      je: toNum(
        ('function' === typeof nav.javaEnabled && nav.javaEnabled()) || false,
      ),
      tid: tagId,
      cid: this.getClientId(),
      _gid: getCookie('_gid'), 
      v: 1, //version
      z: getRandomId(),
      a: pvid,
    };
    seq++;
    const {event: ev, bCookieIndex, bCookie, lazeInfoIndex, lazeInfo} =
      data || {};
    d.t =
      -1 !== (ev || '').toLowerCase().indexOf('view') ? 'pageview' : 'event';
    if (bCookieIndex) {
      d['cd' + bCookieIndex] = bCookie;
    }
    if (lazeInfoIndex) {
      d['cd' + lazeInfoIndex] = lazeInfo;
    }
    return d;
  }
}

export default DataLayerToMp;
