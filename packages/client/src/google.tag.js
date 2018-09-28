import exec from 'exec-script';
import get from 'get-object-value';

import BaseTag, {toJS} from './BaseTag';

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
    const state = this.getState();
    const {
      lazeInfo,
      p,
      action,
      category,
      label,
      value,
      ecommerce,
      ecommerceAddToCart,
      ecommerceRemoveFromCart,
    } = get(toJS(state.get('I13N')), null, {});
    const thisCategory = category ? category : action;
    const currencyCode = state.get('currencyCode');

    let thisLabel = label;
    if (lazeInfo) {
      if ('object' !== typeof thisLabel) {
        thisLabel = {
          label: thisLabel,
          lazeInfo: lazeInfo,
        };
      } else {
        thisLabel.lazeInfo = lazeInfo;
      }
    }
    if ('object' === typeof thisLabel) {
      thisLabel = JSON.stringify(thisLabel);
    }

    let thisEcommerce = ecommerce;
    if (ecommerceAddToCart) {
      thisEcommerce = {
        currencyCode,
        add: {
          products: ecommerceAddToCart,
        },
      };
    } else if (ecommerceRemoveFromCart) {
      thisEcommerce = {
        currencyCode,
        remove: {
          products: ecommerceRemoveFromCart,
        },
      };
    }

    const config = {
      event: 'lucencyEventAction',
      p,
      action,
      category: thisCategory,
      label: thisLabel,
      value,
      ecommerce: thisEcommerce,
    };
    this.push(config);
  }

  impression() {
    const state = this.getState();
    const {p, ecommerceImpressions, ecommerceDetail} = get(
      toJS(state.get('i13nPage')),
      null,
      {},
    );
    const currencyCode = state.get('currencyCode');
    const config = {
      event: 'lucencyEventView',
      p,
    };
    if (ecommerceImpressions) {
      config.ecommerce = {
        currencyCode,
        impressions: ecommerceImpressions,
      };
    } else if (ecommerceDetail) {
      config.ecommerce = ecommerceDetail;
    }
    this.push(config);
  }
}

const instance = new GoogleTag();
export default instance;
