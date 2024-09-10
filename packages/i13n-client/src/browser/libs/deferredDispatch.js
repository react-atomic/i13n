// @ts-check
import { refineAction } from "reshow-flux-base";
import { deferredStore, setLStore } from "../../stores/storage";
import { localStorage, Storage } from "get-storage";

/**
 * @param {any} action
 * @param {any=} actionParams
 */
export const deferredDispatch = (action, actionParams) => {
  const nextAction = refineAction(action, actionParams);
  setLStore(new Storage(localStorage));
  deferredStore().push(nextAction);
};
