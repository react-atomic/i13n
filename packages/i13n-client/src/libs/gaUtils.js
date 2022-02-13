import { KEYS, OBJECT } from "reshow-constant";
import { getDebugFlag } from "../libs/logError";

const mergeGaLabel = (label, more) => {
    let thisLabel = label;
    if (KEYS(more || {}).length) {
      if (OBJECT !== typeof thisLabel) {
        thisLabel = {
          label,
          ...more,
        };
      } else {
        thisLabel = { ...thisLabel, ...more };
      }
    }
    if (OBJECT === typeof thisLabel) {
      thisLabel = JSON.stringify(thisLabel);
    }
    return thisLabel;
};

const getGaHost = () => {
  const host = `https://www.google-analytics.com/${
    getDebugFlag() ? "debug/" : ""
  }collect`;
  return host;
};

export { mergeGaLabel, getGaHost };
