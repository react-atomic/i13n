// @ts-check
import get from "get-object-value";
import set from "set-object-value";

const PARAMS = "params";
/**
 * @typedef {import("reshow-flux-base").ActionObject} ActionObject
 */

/**
 * @param {ActionObject} action
 */
export const getParams = (action) => get(action, [PARAMS], {});
/**
 * @param {ActionObject} action
 * @param {string[]} path
 * @param {any} v
 */
export const setParams = (action, path, v) => set(action, [PARAMS, ...path], v);
