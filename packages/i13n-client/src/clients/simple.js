import startTime from "../actions/startTime"; // start time need put in first line
import { getParams } from "i13n";

// local import
import { i13nDispatch, mergeMap } from "../stores/i13nStore";
import lazyProducts from "../libs/lazyProducts";
import actionHandler from "../actions/actionHandler";

/**
 * Handler
 */
const initHandler = (state, action, initDone) => {
  const params = getParams(action);
  action.asyncInit = true;
  return initDone(mergeMap(state, params), action);
};

const impressionHandler = (state, action) => lazyProducts(state);

const init = (tid) => {
  let isLoad = false;
  const run = () => {
    if (isLoad) {
      return;
    }
    isLoad = true;
    i13nDispatch("reset", {
      initHandler,
      actionHandler,
      impressionHandler,
    });
    i13nDispatch("impression", { tid });
  };
  run();
};

export default init;
