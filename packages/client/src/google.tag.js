import exec from 'exec-script';
import get from 'get-object-value';
import set from 'set-object-value';

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
const keys = Object.keys;

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
    const I13N = get(toJS(state.get('I13N')), null, {});
    const {
      lazeInfo,
      p,
      action,
      category,
      label,
      value,
      products,
      promotions,
      currencyCode,
      stepNo,
      stepOption,
    } = I13N;
    const thisCategory = category ? category : action;
    let thisCurrencyCode = currencyCode;
    if (!thisCurrencyCode) {
      thisCurrencyCode = state.get('currencyCode');
    }

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

    let ecommerce = {};
    switch (action) {
      case 'Checkout':
        ecommerce = {
          checkout: {
            products,
            actionField: {
              step: stepNo,
              option: stepOption,
            },
          },
        };
        break;
      case 'CheckoutOption':
        ecommerce = {
          checkout_option: {
            actionField: {
              step: stepNo,
              option: stepOption,
            },
          },
        };
        break;
      case 'PromotionClick':
        ecommerce = {
          promoClick: {promotions},
        };
        break;
      case 'ProductClick':
        ecommerce = {
          click: {
            products,
            actionField: {
              list: p,
            },
          },
        };
        break;
      case 'AddToCart':
        ecommerce = {
          currencyCode: thisCurrencyCode,
          add: {products},
        };
        break;
      case 'RemoveFromCart':
        ecommerce = {
          currencyCode: thisCurrencyCode,
          remove: {products},
        };
        break;
      case 'Purchase':
        ecommerce = this.handlePurchase(I13N, ecommerce);
        break;
      case 'Refund':
        ecommerce = this.handlePurchase(I13N, ecommerce);
        break;
    }
    const config = {
      event: 'lucencyEventAction',
      p,
      action,
      category: thisCategory,
      label: thisLabel,
      value,
    };
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
    }
    this.push(config);
  }

  handlePurchase(I13N, ecommerce)
  {
    const {
      purchaseId,
      affiliation,
      revenue,
      tax,
      shipping,
      coupon,
      refundId,
      products,
    } = I13N;
    if (purchaseId) {
      set(ecommerce, ['purchase', 'actionField'], {
        id: purchaseId,
        affiliation,
        revenue,
        tax,
        shipping,
        coupon
      });
      set(ecommerce, ['purchase', 'products'], products);
    }
    if (refundId) {
      set(ecommerce, ['refund', 'actionField', 'id'], refundId);
      if (products) {
        set(ecommerce, ['refund', 'products'], products);
      }
    }
    return ecommerce;
  }

  impression() {
    const state = this.getState();
    const I13N = get(toJS(state.get('i13nPage')), null, {});
    const {
      p,
      fromP,
      impressions,
      detailProducts,
      promotions,
      currencyCode,
    } = I13N;
    let ecommerce = {};
    if (impressions) {
      let thisCurrencyCode = currencyCode;
      if (!thisCurrencyCode) {
        thisCurrencyCode = state.get('currencyCode');
      }
      if (thisCurrencyCode) {
        set(ecommerce, ['currencyCode'], thisCurrencyCode);
      }
      set(ecommerce, ['impressions'], impressions);
    }
    if (detailProducts) {
      if (fromP) {
        set(ecommerce, ['detail', 'actionField', 'list'], fromP);
      }
      set(ecommerce, ['detail', 'products'], detailProducts);
    }
    if (promotions) {
      set(ecommerce, ['promoView', 'promotions'], promotions);
    }
    ecommerce = this.handlePurchase(
      I13N,
      ecommerce
    );
    const config = {
      event: 'lucencyEventView',
      p,
    };
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
    }
    this.push(config);
  }
}

const instance = new GoogleTag();
export default instance;
