import exec from 'exec-script';
import get from 'get-object-value';
import set from 'set-object-value';

import BaseTag, {toJS} from './BaseTag';

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

  convertOne(attrKeys, arr, result) {
    keys(attrKeys).forEach(
      key => {
        if (arr[key]) {
          const to = attrKeys[key];
          set(result, [to], arr[key], true);
        }
      }
    );
  }

  converAttr(attrKeys, flats, I13N) {
    if (!attrKeys) {
      return;
    }
    const result = {};
    const defFlats = ['label', 'products', 'impressions', 'detailProducts', 'promotions'];
    if (isArray(flats)) {
      flats = flats.concat(defFlats);
    } else {
      flats = defFlats;
    }
    const thisI13N = {...I13N};
    flats.forEach(flat => {
      if (I13N[flat]) {
        this.convertOne(attrKeys, I13N[flat], result);
        delete thisI13N[flat];
      }
    });
    this.convertOne(attrKeys, thisI13N, result);
    return result;
  }

  action() {
    const state = this.getState();
    const tagData = this.getTagData();
    const {cv, attr, flat} = tagData;
    const I13N = get(toJS(state.get('I13N')), null, {});
    const {p, action, category, label, value} = I13N;
    const type = (-1 !== cv.indexOf(action)) ?
      'cv':
      'event';
    let attribute;
    if ('cv' === type) {
      attribute = this.converAttr(attr, flat, I13N);
    }
    const send = [type, action];
    if (attribute && keys(attribute).length) {
      send.push(attribute);
    } else {
      send.push({category, label, value});
    }
    this.push(send);
  }

  impression() {
    const state = this.getState();
    const I13N = get(toJS(state.get('i13nPage')), null, {});
    this.push(['pv']);
  }
}

const instance = new UsergramTag();
export default instance;
