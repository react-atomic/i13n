import exec from 'exec-script';
import {win} from 'win-doc';
import {getTimestamp} from 'get-random-id';

import BaseGTag from './BaseGTag';

const getScript = gtagId => {
  const script = ` 
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  ${getTimestamp()},event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtagId}');</script>
`;
  return script;
};

class OfficialGTag extends BaseGTag {
  init() {
    const {id} = this.props; 
    exec(getScript(id));
  }

  push(config) {
    win().dataLayer.push(config);
  }
}

export default OfficialGTag;
