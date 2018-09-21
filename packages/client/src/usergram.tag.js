import BaseTag from './BaseTag';
import exec from 'exec-script';

const initTagScript  = ` 
<script type="text/javascript">
(function(){var a=window,b=document,c=a.usergram=a.usergram||[],d,e;
  c.l||(c.s=(new Date()).getTime(),c.l=!0,d=b.getElementsByTagName('script')[0],
    e=b.createElement('script'),e.type='text/javascript',e.async=true,
    e.src='//code.usergram.info/js/usergram.js',d.parentNode.insertBefore(e,d))})();

window.usergram=window.usergram||[];
</script>
`;

const win = () => window;
const keys = Object.keys

class UsergramTag extends BaseTag {
  init() {
    exec(initTagScript);
    console.log('init usergram');
  }

  push(config) {
    const tagData = this.getTagData();
    config.unshift('send', tagData.id)
    win().usergram.push(config);
  }

  action() {
    const state = this.getStore().getState()
    const I13N = state.get('I13N')
    if (!I13N) {
      return
    }
    const {type, action, attribute} = I13N
    const send = [type, action]
    if (attribute && keys(attribute).length) {
      send.push(attribute)
    }
    this.push(send)
  }

  impression() {
    this.push(['pv'])
  }
}

const instance = new UsergramTag();
export default instance;
