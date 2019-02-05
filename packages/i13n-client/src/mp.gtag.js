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
      ev: toNum(value) 
    };
    return data;
  }

  getProductsData(products) {
    if (!isArray(products)) {
      return;
    }
    let pLen = 1;
    const data = {};
    products.forEach(prod => {
      const key = 'pr'+  pLen;
      pLen++;
      this.setOneProduct(key, data, prod);
    });
    return data;
  }

  setOneProduct(key, data, config) {
    const {id, name, category, brand, variant, position, price} = config;
    data[key+'id'] = id; 
    data[key+'nm'] = name; 
    data[key+'ca'] = category; 
    data[key+'br'] = brand;
    data[key+'va'] = variant;
    data[key+'ps'] = position;
    data[key+'pr'] = price;
  }

  getEcClickData(click) {
    if (!click) {
      return;
    }
    const {actionField, products} = click;
    const {action, list} = get(actionField, null, {});
    const data = {
      ...this.getProductsData(products),
      pa: action,
      pal: list,
    };
    return data;
  }

  getImpressionsData(impressions) {
    if (!isArray(impressions)) {
      return;
    }
    let listLen = 1;
    const aList = {};
    const data = {};
    impressions.forEach( ({list, ...prod}) => {
      if (!aList[list]) {
        aList[list] = {
          key: 'il'+listLen,
          n: 1,
        };
        listLen++;
        data[aList[list].key+'nm'] = list;
      }
      const key = aList[list].key+ 'pi'+ aList[list].n;
      aList[list].n++;
      this.setOneProduct(key, data, prod);
    });
    return data;
  }

  getEcData(config) {
    const {ecommerce} = get(config, null, {});
    if (!ecommerce) {
      return;
    }
    const {impressions, click, currencyCode} = ecommerce;
    const data = {
      ...this.getImpressionsData(impressions),
      ...this.getEcClickData(click),
      cu: currencyCode
    };
    return data;
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
      cid: this.getClientId(),
      z: getRandomId(),
    };
    const {event: ev, bCookieIndex, bCookie, lazeInfoIndex, lazeInfo} = get(config, null, {});
    d.t = -1 !== ev.toLowerCase().indexOf('view') ? 'pageview' : 'event';
    d['cd'+bCookieIndex] = bCookie;
    d['cd'+lazeInfoIndex] = lazeInfo;

    console.log([this.props, config, host, d]);
    beacon(host, removeEmpty(d, true));
    seq++;
  }
}

export default MpGTag;
