//@ts-check

import simple from "../../clients/simple";
import { mpTag } from "../../tags/mpTag";
import { getGaHost } from "../../libs/gaUtils";
import { beacon } from "../libs/req";
import { browserMpHandler, getClientHints } from "../actions/getBrowserInfo";

// browser only
import { win } from "win-doc";
import { getScriptTagId } from "../libs/getTagId";

const tid = getScriptTagId();

(async () => {
  /**
   * @type {import("../actions/getBrowserInfo").ClientHintType} ClientHintType
   */
  const clientHints = await getClientHints(win().navigator);
  simple(tid || "", {
    global: win(),
    tags: [
      {
        item: mpTag,
        data: {
          mpHost: getGaHost,
          extraMpHandler: [
            browserMpHandler,
            (/**@type any*/ d) => {
              return {
                ...d,
                uaa: clientHints.architecture,
                uab: clientHints.bitness,
                uafvl: clientHints.fullVersionList,
                uamb: clientHints.mobile,
                uam: clientHints.model,
                uap: clientHints.platform,
                uapv: clientHints.platformVersion,
                uaw: clientHints.wow64,
              };
            },
          ],
        },
      },
    ],
    utils: {
      send: beacon,
    },
  });
})();
