// @ts-check
import get, { toMap } from "get-object-value";
import set from "set-object-value";
import { url } from "seturl";
import callfunc from "call-func";
import { T_NULL, OBJECT, KEYS, IS_ARRAY } from "reshow-constant";

import { getParams } from "./getParams";
import getTime from "./getTime";

const deferredActionStorageKey = "deferredAction";
const PARAMS = "params";
const hashKey = "__hash";
const seqKey = "__seq";

/**
 * @template StateType
 * @template ActionType
 * @typedef {import("reshow-flux-base").DispatchFunction<StateType, ActionType>} DispatchFunction
 */
/**
 * @typedef {Object<sinon,any>} StateType
 */
/**
 * @typedef {import("reshow-flux-base").ActionObject} ActionObject
 */

/**
 * @template StateType
 * @template ActionType
 * @param {any} deferredActionMapObject
 * @param {DispatchFunction<StateType, ActionType>} dispatch
 */
const processDeferredAction = (deferredActionMapObject, dispatch) => {
  /**
   * @param {any} deferredMapOrSeq
   * @param {number|string} key
   */
  const processDeferred = (deferredMapOrSeq, key) => {
    const oneAction = deferredMapOrSeq[key];
    const { wait, stop } = getParams(oneAction);
    if (!wait || wait <= 0) {
      if (!stop) {
        if (null == wait) {
          delete oneAction.params.wait;
        }
        dispatch && dispatch(oneAction);
      }
      delete deferredMapOrSeq[key];
    } else {
      oneAction.params.wait = wait - 1;
    }
    return deferredMapOrSeq[key];
  };

  const seq = get(deferredActionMapObject, [seqKey]);
  if (IS_ARRAY(seq)) {
    deferredActionMapObject.__seq = seq.filter((_action, key) =>
      processDeferred(seq, key)
    );
  }

  const hash = get(deferredActionMapObject, [hashKey]);
  if (hash) {
    KEYS(hash).forEach((key) => processDeferred(hash, key));
  }
  return deferredActionMapObject;
};

/**
 * @typedef {object} StorageType
 * @property {function(string):any} get
 * @property {function(string, any):any} set
 */

/**
 * @param {StorageType} storage
 */
export const DeferredActionUtil = (storage) => {
  const getAllDeferredAction = () =>
    toMap(storage.get(deferredActionStorageKey));
  const getOneDeferredAction = (/**@type string*/ k) =>
    toMap(getAllDeferredAction().__hash)[k];
  const updateDeferredAction = (/**@type any*/ deferredActionMapObject) =>
    storage.set(deferredActionStorageKey, deferredActionMapObject);
  const removeDeferredAction = (/**@type string*/ key) => {
    const deferredActionMapObject = getAllDeferredAction();
    if (get(deferredActionMapObject, [hashKey, key])) {
      delete deferredActionMapObject.__hash[key];
      updateDeferredAction(deferredActionMapObject);
    }
  };

  /**
   * @param {any} action
   * @param {string} key
   */
  const getMergeWithDeferredAction = (action, key) => {
    const deferredActionMapObject = getAllDeferredAction();
    const { stop, wait, deferredAction, deferredKey, ...restParams } = get(
      deferredActionMapObject,
      [hashKey, key, PARAMS],
      {}
    );
    KEYS(restParams).forEach((pKey) => {
      const p = restParams[pKey];
      const newP =
        OBJECT === typeof p
          ? { ...p, ...get(action, [PARAMS, pKey], {}) }
          : get(action, [PARAMS, pKey], p);
      set(action, [PARAMS, pKey], newP);
    });
    delete action.params.mergeWithDeferredKey;
    return action;
  };

  /**
   * @param {any} action
   * @param {string=} key
   */
  const pushDeferredAction = (action, key) => {
    const { ...params } = getParams(action);
    const thisAction = { params, type: action.type };
    set(thisAction, [PARAMS, "deferredAction"], {
      from: url(),
      time: getTime().toString(),
    });
    const deferredActionMapObject = getAllDeferredAction();
    if (key) {
      set(deferredActionMapObject, [hashKey, key], thisAction);
    } else {
      set(deferredActionMapObject, [seqKey], thisAction, true);
    }
    updateDeferredAction(deferredActionMapObject);
  };

  /**
   * @template StateType
   * @template ActionType
   * @param {DispatchFunction<StateType, ActionType>} dispatch
   */
  const process = (dispatch) =>
    updateDeferredAction(
      processDeferredAction(getAllDeferredAction(), dispatch)
    );

  const wrapActionHandler =
    (/**@type any*/ actionHandler) =>
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    (state, action) => {
      const { mergeWithDeferredKey } = getParams(action);
      if (mergeWithDeferredKey) {
        action = getMergeWithDeferredAction(action, mergeWithDeferredKey);
      }
      const next = callfunc(actionHandler, [state, action]) || state;
      const { wait, stop, deferredKey } = getParams(action); // need locate after next
      if (T_NULL == wait && !stop) {
        if (mergeWithDeferredKey && mergeWithDeferredKey !== deferredKey) {
          removeDeferredAction(mergeWithDeferredKey);
        }
      }
      return next;
    };
  return {
    process,
    wrapActionHandler,
    getAll: getAllDeferredAction,
    getOne: getOneDeferredAction,
    push: pushDeferredAction,
  };
};
