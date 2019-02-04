import {win, doc} from 'win-doc';
import get from 'get-object-value';
import getCookie from 'get-cookie';
import {localStorage, Storage} from 'get-storage';
import getRandomId from 'get-random-id';

import BaseGTag from './BaseGTag';
import {beacon} from './req';

let seq = 1;
const X = 'x';
const MP_CLIENT_ID = 'mpClientId';
const lStore = new Storage(localStorage);

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
    const {event: ev} = get(config, null, {});
    d.t = -1 !== ev.toLowerCase().indexOf('view') ? 'pageview' : 'event';

    console.log([this.props, config, host, d]);
    beacon(host, d);
    seq++;
  }
}

export default MpGTag;
