//@ts-check

import simple from "../../clients/simple";
import { mpTag } from "../../tags/mpTag";
import { getGaHost } from "../../libs/gaUtils";
import { beacon } from "../libs/req";
import { browserMpHandler } from "../actions/getBrowserInfo";

// browser only
import { win } from "win-doc";
import { getScriptTagId } from "../libs/getTagId";

const tid = getScriptTagId();

simple(tid || "", {
  global: win(),
  tags: [
    {
      item: mpTag,
      data: {
        mpHost: getGaHost,
        extraMpHandler: [browserMpHandler],
      },
    },
  ],
  utils: {
    send: beacon,
  },
});
