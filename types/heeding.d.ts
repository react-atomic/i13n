export default heeding;
export type StateType = any;
export type ActionObject = import("reshow-flux-base").ActionObject;
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
declare function heeding(func: Function, pool: string): (arg0: StateType, arg1: ActionObject) => StateType;
