// @ts-check
import { SimpleMap } from "reshow-map";
import { T_UNDEFINED } from "reshow-constant";
import { DeferredActionUtil } from "i13n";
import { refineAction } from "reshow-flux-base";

export let sStore = new SimpleMap(T_UNDEFINED, true);
export let lStore = new SimpleMap(T_UNDEFINED, true);

export const setSStore = (/**@type any*/ o) => (sStore = o);
export const setLStore = (/**@type any*/ o) => (lStore = o);

export const deferredStore = () => DeferredActionUtil(lStore);

/**
 * @param {any} action
 * @param {any=} actionParams
 */
export const deferredDispatch = (action, actionParams) => {
  const nextAction = refineAction(action, actionParams);
  deferredStore().push(nextAction);
};
