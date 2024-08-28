//@ts-check
import { KEYS, OBJECT } from "reshow-constant";

/**
 * @param {string} label
 * @param {object=} more
 */
const mergeGaLabel = (label, more) => {
  /**
   * @type any
   */
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
  const host = `https://www.google-analytics.com/g/collect`;
  return host;
};

export { mergeGaLabel, getGaHost };
