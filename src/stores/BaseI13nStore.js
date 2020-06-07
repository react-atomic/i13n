import { Store } from "reshow-flux-base";
import get, { toMap } from "get-object-value";
import set from "set-object-value";
import { localStorage, Storage } from "get-storage";
import { UNDEFINED, FUNCTION, OBJECT } from "reshow-constant";
import { doc } from "win-doc";

import { i13nDispatch } from "../i13nDispatcher";
import getTime from "../getTime";
import getParams from "../getParams";

const lStore = new Storage(localStorage);
const docUrl = () => doc().URL;
const isArray = Array.isArray;
const keys = Object.keys;
const PARAMS = "params";
const hashKey = "__hash";
const seqKey = "__seq";
const lazyActionKey = "lazyAction";

class BaseI13nStore extends Store {
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
          i13nDispatch(laze);
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
      keys(hash).forEach(key => processLazy(hash, key));
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
      time: getTime().toString()
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
    keys(lazeParams).forEach(pKey => {
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
    this.nextEmits.push("init");
    state = state.set("init", true);
    i13nDispatch(state); // for async, need located before lazyAction
    const lazyAction = this.getLazy();
    if (lazyAction) {
      this.processLazyAction(lazyAction);
    }
    const { processClose, ...nextAction  } = action || {};
    const run = () => i13nDispatch(keys(nextAction).length ? nextAction : "view");
    if (FUNCTION === typeof processClose) {
      processClose(run); 
    } else {
      run();
    }
    return state;
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
    const run = state => {
      let impressionHandler = state.get("impressionHandler");
      if (!impressionHandler) {
        impressionHandler = this.processView.bind(this);
      }
      const next = impressionHandler(state, action);
      const { wait, stop } = getParams(action); // need locate after next
      if (UNDEFINED === typeof wait && !stop) {
        // execute send beacon
        this.nextEmits.push("impression");
      }
      return next;
    };
    const init = state.get("init");
    if (!init) {
      return this.handleInit(state, action);
    } else {
      return run(state);
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
    const next = actionHandler(state, action);
    const { wait, stop, lazyKey } = getParams(action); // need locate after next
    if (UNDEFINED === typeof wait && !stop) {
      // execute send beacon
      this.nextEmits.push("action");
      if (withLazy && withLazy !== lazyKey) {
        this.removeLazy(withLazy);
      }
    }
    return next;
  }

  reduce(state, action) {
    switch (action.type) {
      case "view":
        return this.handleImpression(state, action);
      case "action":
        return this.handleAction(state, action);
      case "config/set":
        return state.merge(action.params);
      case "reset":
        /**
         * !!Important!!
         * Keep in mind, always don't reset localstorage
         * It will effect lazy action
         */
        return this.reset().merge(action.params);
      default:
        return !!keys(action).length ? state.merge(action) : state;
    }
  }
}

export default BaseI13nStore;
