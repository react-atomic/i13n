// @ts-check

import callfunc from "call-func";

/**
 * @typedef {Object<sinon,any>} StateType
 */
/**
 * @typedef {import("reshow-flux-base").ActionObject} ActionObject
 */

/**
 * @param {function} func
 * @param {string} pool
 * @returns {function(StateType, ActionObject): StateType}
 */
const heeding = (func, pool) => (state, action) => {
  if (state?.get("nextEmit") === pool) {
    callfunc(func, [state, action]);
  }
  return state;
};

export default heeding;
