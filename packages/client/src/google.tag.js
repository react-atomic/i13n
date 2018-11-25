import exec from 'exec-script';
import get from 'get-object-value';

import BaseTag from './BaseTag';
import {getViewEcommerce, getActionEcommerce} from './google.ecommerce';

const getScript = gtagId => {
  const script = ` 
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtagId}');</script>
`;
  return script;
};

const win = () => window;
const keys = Object.keys;

class GoogleTag extends BaseTag {
  isInit = false;

  init() {
    const tagData = this.getTagData();
    exec(getScript(tagData.id));
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
    if (lazeInfoIndex) {
      config.lazeInfoIndex = lazeInfoIndex;
    }
    config.gaId = gaId;
    win().dataLayer.push(config);
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
      lazeInfo,
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
