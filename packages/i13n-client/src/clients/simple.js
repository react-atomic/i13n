import startTime from "../actions/startTime"; // start time need put in first line
import { getParams } from "i13n";
import callfunc from "call-func";
import get from "get-object-value";

// local import
import { i13nStore, i13nDispatch, mergeMap } from "../stores/i13nStore";

//libs
import lazyProducts from "../libs/lazyProducts";
import workerUtils from "../libs/workerUtils";
import { getGaHost } from "../libs/gaUtils";

// action
import actionHandler from "../actions/actionHandler";
import getTag from "../actions/getTag";

const initTags = (config) => {
  const tagArr = get(config, ["tags"], []);
  let i = tagArr.length;
  while (i--) {
    getTag(tagArr[i]);
  }
};

/**
 * Handler
 */
const initHandler = (state, action, initDone) => {
  const params = getParams(action);
  initTags({ ...get(state), ...params });
  action.asyncInit = true;
  return initDone(mergeMap(state, params), action);
};

const impressionHandler = (state, action) => lazyProducts(state);

const init = (
  trackingId,
  { global = {}, globalKey = "i13n", utils = workerUtils } = {}
) => {
  let isLoad = false;
  const run = () => {
    if (isLoad) {
      return;
    }
    global[globalKey] = callfunc(utils);
    isLoad = true;
    i13nDispatch("reset", {
      initHandler,
      actionHandler,
      impressionHandler,
    });
    i13nDispatch("impression", { trackingId, tags: [{
      mpHost: getGaHost
    }] });
  };
  run();
};

export default init;
