import get, { toMap } from "get-object-value";
import set from "set-object-value";
import { localStorage, Storage } from "get-storage";
import { UNDEFINED, FUNCTION, OBJECT, KEYS } from "reshow-constant";
import { doc } from "win-doc";

import getTime from "../getTime";
import getParams from "../getParams";

const lStore = new Storage(localStorage);
const docUrl = () => doc().URL;
const isArray = Array.isArray;
const PARAMS = "params";
const hashKey = "__hash";
const seqKey = "__seq";
const lazyActionKey = "lazyAction";
const INITIAL = "init";

class BaseI13nStore {
  sendBeacon(state, action) {
    return state;
  }

  processLazyAction(lazyAction) {
    const processLazy = (lazeArr, key) => {
      const laze = lazeArr[key];
      let { wait, stop } = getParams(laze);
      if (!wait || wait <= 0) {
        if (!stop) {
          if (UNDEFINED !== typeof get(laze, ["params", "wait"])) {
            delete laze.params.wait;
          }
          this.dispatch(laze);
        }
        delete lazeArr[key];
      } else {
        laze.params.wait = --wait;
      }
      return lazeArr[key];
    };

    const seq = get(lazyAction, [seqKey]);
    if (isArray(seq)) {
      lazyAction.__seq = seq.filter((action, key) => processLazy(seq, key));
    }

    const hash = get(lazyAction, [hashKey]);
    if (hash) {
      KEYS(hash).forEach((key) => processLazy(hash, key));
    }

    lStore.set(lazyActionKey, lazyAction);
  }

  processAction(state, action) {
    const vpvid = state.get("vpvid");
    if (vpvid) {
      set(action, [PARAMS, "query", "vpvid"], vpvid);
    }
    return this.sendBeacon(state, action);
  }

  processView(state, action) {
    return this.sendBeacon(state, action);
  }

  pushLazyAction(action, key) {
    const { ...params } = getParams(action);
    const thisAction = { params, type: action.type };
    set(thisAction, [PARAMS, "lazeInfo"], {
      from: docUrl(),
      time: getTime().toString(),
    });
    const lazyAction = this.getLazy();
    if (key) {
      set(lazyAction, [hashKey, key], thisAction);
    } else {
      set(lazyAction, [seqKey], thisAction, true);
    }
    lStore.set(lazyActionKey, lazyAction);
  }

  mergeWithLazy(action, key) {
    const lazyAction = this.getLazy();
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
  }

  removeLazy(key) {
    const lazyAction = this.getLazy();
    if (get(lazyAction, [hashKey, key])) {
      delete lazyAction.__hash[key];
      lStore.set(lazyActionKey, lazyAction);
    }
  }

  getLazy(key) {
    const lazyAction = toMap(lStore.get(lazyActionKey));
    return UNDEFINED === typeof key
      ? lazyAction
      : toMap(lazyAction.__hash)[key];
  }

  initDone = (state, action) => {
    const { processClose, ...nextAction } = action || {};

    const run = () =>
      this.dispatch(KEYS(nextAction).length ? nextAction : "view");

    // this.nextAsync = true;
    // this.nextEmits.push(INITIAL);
    // will trigger on next dispatch

    const runProcessClose = () =>
      FUNCTION === typeof processClose ? processClose(run) : run();

    setTimeout(() => {
      this.dispatch(state.set(INITIAL, true).set("nextEmit", INITIAL)); // for async, need located before lazyAction
      runProcessClose();
      const lazyAction = this.getLazy();
      if (lazyAction) {
        this.processLazyAction(lazyAction);
      }
    });
    return state.set(INITIAL, true).set("nextEmit", INITIAL);
  };

  handleInit(state, action) {
    const initHandler = state.get("initHandler");
    if (FUNCTION === typeof initHandler) {
      return initHandler(state, action, this.initDone);
    } else {
      return this.initDone(state, action);
    }
  }

  handleImpression(state, action) {
    state = state.set("lastUrl", docUrl());
    const run = (state) => {
      let impressionHandler = state.get("impressionHandler");
      if (!impressionHandler) {
        impressionHandler = this.processView.bind(this);
      }
      let next = impressionHandler(state, action);
      const { wait, stop } = getParams(action); // need locate after next
      if (UNDEFINED === typeof wait && !stop) {
        // execute send beacon
        next = next.set("nextEmit", "impression");
        // this.nextEmits.push("impression");
      }
      return next;
    };
    const init = state.get(INITIAL);
    if (!init) {
      return this.handleInit(state, action);
    } else {
      const disableHandleImpression = state.get("disableHandleImpression");
      return disableHandleImpression ? state : run(state);
    }
  }

  handleAction(state, action) {
    let actionHandler = state.get("actionHandler");
    const { withLazy } = getParams(action);
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
    }
    if (withLazy) {
      action = this.mergeWithLazy(action, withLazy);
    }
    let next = actionHandler(state, action);
    const { wait, stop, lazyKey } = getParams(action); // need locate after next
    if (UNDEFINED === typeof wait && !stop) {
      // execute send beacon
      // this.nextEmits.push("action");
      next = next.set("nextEmit", "action");
      if (withLazy && withLazy !== lazyKey) {
        this.removeLazy(withLazy);
      }
    }
    return next;
  }

  reduce(state, action) {
    if (state.get("nextEmit")) {
      state = state.set("nextEmit", null);
    }
    switch (action.type) {
      case "view":
        return this.handleImpression(state, action);
      case "action":
        return this.handleAction(state, action);
      case "config/set":
        return this.mergeMap(state, action.params);
      case "reset":
        /**
         * !!Important!!
         * Keep in mind, always don't reset localstorage
         * It will effect lazy action
         */
        return this.mergeMap(this.store.reset(), action.params);
      default:
        return KEYS(action).length ? this.mergeMap(state, action) : state;
    }
  }
}

export default BaseI13nStore;
