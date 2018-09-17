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

class UsergramTag extends BaseTag {
  init() {
    exec(initTagScript);
    console.log('init usergram');
  }

  action() {
    console.log('action usergram');
  }

  impression() {
    console.log('impression usergram');
  }
}

const instance = new UsergramTag();
export default instance;
