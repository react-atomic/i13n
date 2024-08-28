// @ts-check
import { localStorage, Storage } from "get-storage";
import get, { toMap } from "get-object-value";
import set from "set-object-value";
import { url } from "seturl";
import callfunc from "call-func";
import { T_NULL, UNDEFINED, OBJECT, KEYS, IS_ARRAY } from "reshow-constant";

import { getParams } from "./getParams";
import getTime from "./getTime";

const lazyActionKey = "lazyAction";
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
 * @param {any} lazyAction
 * @param {DispatchFunction<StateType, ActionType>} dispatch
 */
const processLazyAction = (lazyAction, dispatch) => {
  /**
   * @param {any} lazeArr
   * @param {number|string} key
   */
  const processLazy = (lazeArr, key) => {
    const laze = lazeArr[key];
    const { wait, stop } = getParams(laze);
    if (!wait || wait <= 0) {
      if (!stop) {
        if (UNDEFINED !== typeof get(laze, ["params", "wait"])) {
          delete laze.params.wait;
        }
        dispatch && dispatch(laze);
      }
      delete lazeArr[key];
    } else {
      laze.params.wait = wait - 1;
    }
    return lazeArr[key];
  };

  const seq = get(lazyAction, [seqKey]);
  if (IS_ARRAY(seq)) {
    lazyAction.__seq = seq.filter((_action, key) => processLazy(seq, key));
  }

  const hash = get(lazyAction, [hashKey]);
  if (hash) {
    KEYS(hash).forEach((key) => processLazy(hash, key));
  }
  return lazyAction;
};

const getDefaultStorage = () => new Storage(localStorage);

/**
 * @param {Storage} storage
 */
const initLazyAction = (storage) => {
  storage = storage || getDefaultStorage();
  const getAllLazy = () => toMap(storage.get(lazyActionKey));
  const getOneLazy = (/**@type string*/ k) => toMap(getAllLazy().__hash)[k];
  const updateLazy = (/**@type any*/ lazyAction) =>
    storage.set(lazyActionKey, lazyAction);
  const removeLazy = (/**@type string*/ key) => {
    const lazyAction = getAllLazy();
    if (get(lazyAction, [hashKey, key])) {
      delete lazyAction.__hash[key];
      updateLazy(lazyAction);
    }
  };

  /**
   * @param {any} action
   * @param {string} key
   */
  const getActionMergeWithLazy = (action, key) => {
    const lazyAction = getAllLazy();
    const { stop, wait, lazeInfo, lazyKey, ...lazeParams } = get(
      lazyAction,
      [hashKey, key, PARAMS],
      {}
    );
    KEYS(lazeParams).forEach((pKey) => {
      const p = lazeParams[pKey];
      const newP =
        OBJECT === typeof p
          ? { ...p, ...get(action, [PARAMS, pKey], {}) }
          : get(action, [PARAMS, pKey], p);
      set(action, [PARAMS, pKey], newP);
    });
    delete action.params.withLazy;
    return action;
  };

  /**
   * @param {any} action
   * @param {string} key
   */
  const pushLazyAction = (action, key) => {
    const { ...params } = getParams(action);
    const thisAction = { params, type: action.type };
    set(thisAction, [PARAMS, "lazeInfo"], {
      from: url(),
      time: getTime().toString(),
    });
    const lazyAction = getAllLazy();
    if (key) {
      set(lazyAction, [hashKey, key], thisAction);
    } else {
      set(lazyAction, [seqKey], thisAction, true);
    }
    updateLazy(lazyAction);
  };

  /**
   * @template StateType
   * @template ActionType
   * @param {DispatchFunction<StateType, ActionType>} dispatch
   */
  const process = (dispatch) =>
    updateLazy(processLazyAction(getAllLazy(), dispatch));

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
  const handleAction = (state, action) => {
    const { withLazy } = getParams(action);
    if (withLazy) {
      action = getActionMergeWithLazy(action, withLazy);
    }
    const actionHandler = state.get("lazyActionHandler");
    const next = callfunc(actionHandler, [state, action]) || state;
    const { wait, stop, lazyKey } = getParams(action); // need locate after next
    if (T_NULL == wait && !stop) {
      if (withLazy && withLazy !== lazyKey) {
        removeLazy(withLazy);
      }
    }
    return next;
  };
  return {
    process,
    handleAction,
    getAll: getAllLazy,
    getOne: getOneLazy,
    push: pushLazyAction,
  };
};

export default initLazyAction;
