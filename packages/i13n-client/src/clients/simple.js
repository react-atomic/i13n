// @ts-check
import getStartTime from "../actions/startTime"; // start time need put in first line
getStartTime();

import { getParams, setParams } from "i13n";
import callfunc from "call-func";
import get from "get-object-value";

// local import
import { i13nDispatch, mergeMap } from "../stores/i13nStore";

//libs
import lazyProducts from "../libs/lazyProducts";
import workerUtils from "../libs/workerUtils";
import { getGaHost } from "../libs/gaUtils";

// action
import actionHandler from "../actions/actionHandler";
import getTag from "../actions/getTag";

const initTags = (/**@type any*/ config) => {
  const tagArr = get(config, ["tags"], []);
  let i = tagArr.length;
  while (i--) {
    getTag(tagArr[i]);
  }
};

/**
 * @typedef {Object<sinon,any>} StateType
 */
/**
 * @typedef {import("reshow-flux-base").ActionObject} ActionObject
 */

/**
 * Handler
 * @param {StateType} state
 * @param {ActionObject} action
 * @param {Function} initDone
 */
const initHandler = (state, action, initDone) => {
  const params = getParams(action);
  initTags({ ...get(state), ...params });
  setParams(action, ["asyncInit"], true);
  return initDone(mergeMap(state, params), action);
};

/**
 * @param {StateType} state
 */
const impressionHandler = (state) => lazyProducts(state);

/**
 * @param {string} trackingId
 * @param {Object<string, any>} options
 */
export default function initSimpleClient(trackingId, options) {
  const {
    global = {},
    globalKey = "i13n",
    utils = workerUtils,
  } = options || {};
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
    i13nDispatch("impression", {
      trackingId,
      tags: [
        {
          mpHost: getGaHost,
        },
      ],
    });
  };
  run();
}
