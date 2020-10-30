import exec from "exec-script";
import { win } from "win-doc";
import startTime from "./startTime";

import BaseGTag from "./BaseGTag";

const dlKey = 'dataLayer';

const getScript = (gtagId) => {
  const script = `<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  ${startTime},event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='${dlKey}'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','${dlKey}','${gtagId}');</script>
`;
  return script;
};

let isNotSupport = false;

class OfficialGTag extends BaseGTag {
  init() {
    try {
      const _ = top.location.href;
    } catch (e) {
      console.warn("Not support GTM", { e });
      isNotSupport = true;
    }
    if (!isNotSupport) {
      const { id } = this.props;
      exec(getScript(id));
    }
  }

  push(config) {
    if (!isNotSupport) {
      win()[dlKey].push(config);
    }
  }
}

export default OfficialGTag;
