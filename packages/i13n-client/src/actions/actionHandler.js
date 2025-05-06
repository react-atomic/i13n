//@ts-check

import { getParams, setParams, INITIAL } from "i13n";
import { deferredStore } from "../stores/storage";
import { FUNCTION, UNDEFINED, KEYS } from "reshow-constant";

// local import
import { i13nDispatch } from "../stores/i13nStore";
import { getCbParams } from "../libs/storeCbParams";
import oneTimeAction from "../libs/oneTimeAction";

/**
 * @param {any} state
 * @param {any} action
 */
const maybeDeferredAction = (state, action) => () => {
  if (!state.get(INITIAL)) {
    setParams(action, ["wait"], 0);
  }
  const [cbParams, { 0: i13nLastEvent, 1: currentTarget }] = getCbParams();
  const params = getParams(action);
  if (!isNaN(params.delay)) {
    delete action.params.delay;
  }
  const { i13nCb, i13nPageCb, wait, deferredKey, deferredAction } = params;
  let I13N = params.I13N;
  if (deferredAction) {
    I13N.deferredAction = deferredAction;
  }
  if (FUNCTION === typeof i13nCb) {
    cbParams.currentTarget = cbParams.currentTarget ?? currentTarget;
    I13N = i13nCb(i13nLastEvent, I13N ?? {}, cbParams, state);
    delete action.params.i13nCb;
  }

  // reset I13N
  I13N = oneTimeAction(I13N, state);
  state = state.set("I13N", I13N);
  if (!I13N) {
    setParams(action, ["stop"], true);
  } else {
    if (UNDEFINED !== typeof wait) {
     //  setParams(action, ["I13N"], forEachStoreProducts(I13N));
      deferredStore().push(action, deferredKey);
    }
  }

  if (FUNCTION === typeof i13nPageCb) {
    const i13nPage = i13nPageCb(action, I13N, cbParams);
    if (i13nPage) {
      const stateI13nPage = state.get("i13nPage");
      state = state.set(
        "i13nPage",
        stateI13nPage ? stateI13nPage.merge(i13nPage) : i13nPage
      );
    }
  }
  return state;
};

/**
 * @param {any} state
 * @param {any} action
 */
const actionHandler = (state, action) => {
  const { delay, wait } = getParams(action);
  const run = maybeDeferredAction(state, action);
  if (!isNaN(delay)) {
    setTimeout(() => {
      const state = run();
      if (state) {
        i13nDispatch(state);
      }
      const I13N = state.get("I13N");
      if (UNDEFINED === typeof wait && KEYS(I13N.toJS()).length) {
        i13nDispatch("action", { I13N });
      }
    }, delay);
    setParams(action, ["stop"], true);
  } else {
    state = run();
  }
  return state;
};

export default actionHandler;
