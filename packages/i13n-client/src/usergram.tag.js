import exec from 'exec-script';
import get from 'get-object-value';
import set from 'set-object-value';
import {UNDEFINED} from 'reshow-constant';

import BaseTag from './BaseTag';

const getScript = tagData => {
  const jsName = tagData.test ? 'usergram_test.js' : 'usergram.js';
  const script = ` 
<script>
(function(){var a=window,b=document,c=a.usergram=a.usergram||[],d,e;
  c.l||(c.s=(new Date()).getTime(),c.l=!0,d=b.getElementsByTagName('script')[0],
    e=b.createElement('script'),e.type='text/javascript',e.async=true,
    e.src='//code.usergram.info/js/${jsName}',d.parentNode.insertBefore(e,d))})();

window.usergram=window.usergram||[];
</script>
`;
  return script;
};

const win = () => window;
const keys = Object.keys;
const isArray = Array.isArray;

class UsergramTag extends BaseTag {
  init() {
    if (!win().usergram) {
      const tagData = this.getTagData();
      const script = getScript(tagData);
      exec(script);
    }
  }

  push(config) {
    const tagData = this.getTagData();
    config.unshift('send', tagData.id);
    win().usergram.push(config);
  }

  assignUid(att) {
    const state = this.getState();
    const uid = state.get('uid');
    if (UNDEFINED === typeof uid) {
      return att;
    } else {
      if (!att) {
        att = {};
      }
      att.serviceId = uid;
      return att;
    }
  }

  convertOne(attrKeys, arr, result) {
    keys(attrKeys).forEach(key => {
      const to = attrKeys[key];
      arr.forEach(a => {
        if (a[key]) {
          set(result, [to], a[key], true);
        }
      });
    });
  }

  converAttr(attrKeys, flats, I13N) {
    if (!attrKeys) {
      return;
    }
    const result = {};
    const defFlats = [
      'label',
      'products',
      'impressions',
      'detailProducts',
      'promotions',
    ];
    if (isArray(flats)) {
      flats = flats.concat(defFlats);
    } else {
      flats = defFlats;
    }
    const thisI13N = {...I13N};
    flats.forEach(flat => {
      let arr = thisI13N[flat];
      if (arr) {
        if (!isArray(arr)) {
          arr = [arr];
        }
        this.convertOne(attrKeys, arr, result);
        delete thisI13N[flat];
      }
    });
    this.convertOne(attrKeys, [thisI13N], result);
    return result;
  }

  action() {
    const tagData = this.getTagData();
    const {cv, attr, flat} = tagData;
    const I13N = this.getClone('I13N');
    const {p, action, category, value, ...others} = I13N;
    const type = cv && action && -1 !== cv.indexOf(action) ? 'cv' : 'event';
    let attribute;
    if ('cv' === type) {
      attribute = this.converAttr(attr, flat, I13N);
    }
    const send = [type, action];
    if (!attribute || !keys(attribute).length) {
      const label = get(I13N, ['label'], others);
      attribute = {
        p,
        category,
        label,
        value,
      };
    }
    send.push(this.assignUid(attribute));
    this.push(send);
  }

  handleEcImpression(I13N) {
    const {p, fromP, impressions, detailProducts, promotions} = I13N;
    if (impressions) {
      this.push(['event', 'ProductImpression', {impressions}]);
    }
    if (detailProducts) {
      this.push(['event', 'ProductDetailImpression', {detailProducts}]);
    }
    if (promotions) {
      this.push(['event', 'PromotionImpression', {promotions}]);
    }
  }

  impression() {
    const I13N = this.getClone('i13nPage');
    const attribute = this.assignUid(attribute);
    this.push(['pv', attribute]);
    this.handleEcImpression(I13N);
  }
}

export default UsergramTag;
