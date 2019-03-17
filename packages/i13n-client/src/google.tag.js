import get from 'get-object-value';

import BaseTag from './BaseTag';
import {getViewEcommerce, getActionEcommerce} from './google.ecommerce';
import OfficialGTag from './official.gtag';
import MpGTag from './mp.gtag';

const keys = Object.keys;
const downstreamMap = {
  mp: MpGTag,
  official: OfficialGTag,
};

class GoogleTag extends BaseTag {
  isInit = false;

  downstreams = [];

  init() {
    const tagData = this.getTagData();
    const {id, downstreams} = tagData;
    get(downstreams, null, []).forEach( downstreamKey => {
      const obj = downstreamMap[downstreamKey];
      if (!obj) {
        console.warn('Downstream is not found. ['+downstreamKey+']');
        return;
      }
      const oDownstream = new obj(tagData);
      this.downstreams.push(oDownstream);
      oDownstream.init(); 
    });
  }

  push(config) {
    const {gaId, bCookieIndex, lazeInfoIndex} = this.getTagData();
    const state = this.getState();
    const uid = state.get('uid');
    if (uid) {
      config.bCookie = uid;
      if (bCookieIndex) {
        config.bCookieIndex = bCookieIndex;
      }
    }
    if (config.lazeInfo && lazeInfoIndex) {
      config.lazeInfoIndex = lazeInfoIndex;
    }
    config.expId = state.get('expId');
    config.expVar = state.get('expVar');
    config.gaId = gaId;
    this.downstreams.forEach(downstream => downstream.push(config));
  }

  mergeLabel(label, more) {
    let thisLabel = label;
    if (keys(more).length) {
      if ('object' !== typeof thisLabel) {
        thisLabel = {
          label,
          ...more,
        };
      } else {
        thisLabel = {...thisLabel, ...more};
      }
    }
    if ('object' === typeof thisLabel) {
      thisLabel = JSON.stringify(thisLabel);
    }
    return thisLabel;
  }

  action() {
    const state = this.getState();
    const I13N = this.getClone('I13N');
    const {lazeInfo, action, category, label, value} = I13N;
    const p = get(I13N, ['p'], null);
    const thisCategory = category ? category : action;

    const more = {};

    const config = {
      event: 'lucencyEventAction',
      p,
      action,
      category: thisCategory,
      value,
      lazeInfo: JSON.stringify(lazeInfo),
    };

    const ecommerce = getActionEcommerce(I13N, state.get('currencyCode'));
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
      config.category = 'Ecommerce';
      more.ecommerce = ecommerce;
    }
    config.label = this.mergeLabel(label, more);
    this.push(config);
  }

  impression() {
    const state = this.getState();
    const I13N = this.getClone('i13nPage');
    const p = get(I13N, ['p'], null);

    const config = {
      event: 'lucencyEventView',
      p,
    };

    const ecommerce = getViewEcommerce(I13N, state.get('currencyCode'));
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
    }

    this.push(config);
  }
}

const instance = new GoogleTag();
export default instance;
