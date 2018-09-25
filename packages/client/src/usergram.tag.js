import exec from 'exec-script';
import get from 'get-object-value';

import BaseTag from './BaseTag';

const getScript = tagData => {
  const jsName = tagData.test ? 'usergram_test.js' : 'usergram.js';
  const script = ` 
<script type="text/javascript">
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

class UsergramTag extends BaseTag {
  init() {
    const tagData = this.getTagData();
    const script = getScript(tagData);
    exec(script);
  }

  push(config) {
    const tagData = this.getTagData();
    config.unshift('send', tagData.id);
    win().usergram.push(config);
  }

  action() {
    const state = this.getStore().getState();
    const {type, attribute, p, action, category, label, value} = get(
      state.get('I13N'),
      null,
      {},
    );
    const send = [type, action];
    if (attribute && keys(attribute).length) {
      send.push(attribute);
    } else {
      send.push({category, label, value});
    }
    this.push(send);
  }

  impression() {
    this.push(['pv']);
  }
}

const instance = new UsergramTag();
export default instance;
