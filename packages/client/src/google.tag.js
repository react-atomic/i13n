import exec from 'exec-script';
import get from 'get-object-value';

import BaseTag from './BaseTag';

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

class GoogleTag extends BaseTag {
  isInit = false;

  init() {
    const tagData = this.getTagData();
    exec(getScript(tagData.id));
  }

  push(config) {
    const tagData = this.getTagData();
    config.gaId = tagData.gaId;
    win().dataLayer.push(config);
  }

  action() {
    const state = this.getStore().getState();
    const {lazeInfo, p, action, category, label, value} = get(state.get('I13N'), null, {});
    const thisCategory = (category) ? category : action;
    let thisLabel = label
    if (lazeInfo) {
      if ('object' !== typeof thisLabel) {
        thisLabel = {
          label: thisLabel,
          lazeInfo: lazeInfo
        }
      } else {
        thisLabel.lazeInfo = lazeInfo
      }
    }
    if ('object' === typeof thisLabel) {
      thisLabel = JSON.stringify(thisLabel)
    }
    const config = {
      event: 'lucencyEventAction',
      p,
      action,
      category: thisCategory,
      label: thisLabel,
      value,
    };
    this.push(config);
  }

  impression() {
    const state = this.getStore().getState();
    const {p} = get(state.get('I13N'), null, {});
    const config = {
      event: 'lucencyEventView',
      p,
    };
    this.push(config);
  }
}

const instance = new GoogleTag();
export default instance;
