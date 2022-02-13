import { getParams, LazyAction } from "i13n";
import { FUNCTION, UNDEFINED, KEYS } from "reshow-constant";
import set from "set-object-value";

// local import
import { i13nStore, i13nDispatch } from "../stores/i13nStore";
import { lStore } from "../stores/storage";
import storeCbParams, { getCbParams } from "../libs/storeCbParams";
import lazyProducts, { forEachStoreProducts } from "../libs/lazyProducts";
import oneTimeAction from "../libs/oneTimeAction";

const oLazy = LazyAction(lStore);
const PARAMS = "params";

const maybeDelayAction = (state, action) => () => {
  if (!state.get("init")) {
    set(action, [PARAMS, "wait"], 0);
  }
  const [cbParams, { 0: i13nLastEvent, 1: currentTarget }] = getCbParams();
  const params = getParams(action);
  if (!isNaN(params.delay)) {
    delete action.params.delay;
  }
  const { i13nCb, lazeInfo, i13nPageCb, wait, lazyKey } = params;
  let I13N = params.I13N;
  if (lazeInfo) {
    I13N.lazeInfo = lazeInfo;
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
    set(action, [PARAMS, "stop"], true);
  } else {
    if (UNDEFINED !== typeof wait) {
      set(action, [PARAMS, "I13N"], forEachStoreProducts(I13N));
      oLazy.push(action, lazyKey);
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
  return lazyProducts(state);
};

const actionHandler = (state, action) => {
  const { delay, wait } = getParams(action);
  const run = maybeDelayAction(state, action);
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
    set(action, [PARAMS, "stop"], true);
  } else {
    state = run();
  }
  return state;
};

export default actionHandler;
