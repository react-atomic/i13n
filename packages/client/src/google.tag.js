import BaseTag from './BaseTag';
import exec from 'exec-script';

const initTagScript  = ` 
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(parent.window,parent.document,'script','dataLayer','GTM-TW79K5B');</script>
`;
const win = () => window;

class GoogleTag extends BaseTag {
  init() {
    exec(initTagScript);
    console.log('init google');
  }

  action() {
    console.log('action google');
  }

  impression() {
    const config = {
      gaId: 'UA-124534784-1',
      event: 'lucencyEventView',
      p: 'test',
    };
    win().dataLayer.push(config);
    console.log('impression google');
  }
}

const instance = new GoogleTag();
export default instance;
