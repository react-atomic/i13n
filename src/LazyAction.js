import { localStorage, Storage } from "get-storage";
import get, { toMap } from "get-object-value";
import set from "set-object-value";
import { doc } from "win-doc";
import callfunc from "call-func";
import { T_NULL, UNDEFINED, OBJECT, KEYS, IS_ARRAY } from "reshow-constant";

import getParams from "./getParams";
import getTime from "./getTime";

const lazyActionKey = "lazyAction";
const PARAMS = "params";
const hashKey = "__hash";
const seqKey = "__seq";
const docUrl = () => doc().URL;

const processLazyAction = (lazyAction, dispatch) => {
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
      laze.params.wait = --wait;
    }
    return lazeArr[key];
  };

  const seq = get(lazyAction, [seqKey]);
  if (IS_ARRAY(seq)) {
    lazyAction.__seq = seq.filter((action, key) => processLazy(seq, key));
  }

  const hash = get(lazyAction, [hashKey]);
  if (hash) {
    KEYS(hash).forEach((key) => processLazy(hash, key));
  }
  return lazyAction;
};

const getDefaultStorage = () => new Storage(localStorage);

const initLazyAction = (storage) => {
  storage = storage || getDefaultStorage();
  const getAllLazy = () => toMap(storage.get(lazyActionKey));
  const getOneLazy = (k) => toMap(getAllLazy().__hash)[k];
  const updateLazy = (lazyAction) => storage.set(lazyActionKey, lazyAction);
  const removeLazy = (key) => {
    const lazyAction = getAllLazy();
    if (get(lazyAction, [hashKey, key])) {
      delete lazyAction.__hash[key];
      updateLazy(lazyAction);
    }
  };
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
  const pushLazyAction = (action, key) => {
    const { ...params } = getParams(action);
    const thisAction = { params, type: action.type };
    set(thisAction, [PARAMS, "lazeInfo"], {
      from: docUrl(),
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
  const process = (dispatch) =>
    updateLazy(processLazyAction(getAllLazy(), dispatch));
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
