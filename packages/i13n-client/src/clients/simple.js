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

// action
import actionHandler from "../actions/actionHandler";
import getTag from "../actions/getTag";
import { deferredStore } from "../stores/storage";

const initTags = (/**@type any*/ options) => {
  const tagArr = get(options, ["tags"], []);
  let i = tagArr.length;
  while (i--) {
    getTag(tagArr[i].item, tagArr[i].data, options.utils);
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
  const mergeState = mergeMap(state, params);
  initTags(mergeState.toJS());
  setParams(action, ["asyncInit"], true);
  setTimeout(() => deferredStore().process(i13nDispatch));
  return initDone(mergeState, action);
};

/**
 * @param {StateType} state
 */
const impressionHandler = (state) => lazyProducts(state);

/**
 * @param {string} trackingId
 * @param {Object<string, any>=} options
 */
export default function initSimpleClient(trackingId, options) {
  const {
    tags,
    global = {},
    globalKey = "i13n",
    utils = workerUtils(),
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
      actionHandler: deferredStore().wrapActionHandler(actionHandler),
      impressionHandler,
    });
    i13nDispatch("impression", {
      trackingId,
      tags,
      utils,
    });
  };
  run();
}
