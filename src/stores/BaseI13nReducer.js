import { UNDEFINED, FUNCTION, OBJECT, KEYS } from "reshow-constant";
import set from "set-object-value";
import callfunc from "call-func";

import heeding from "../heeding";
import getParams from "../getParams";

const INITIAL = "init";

class BaseI13nReducer {
  sendBeacon(state, action) {
    return state;
  }

  initDone(state, action) {
    const { triggerImpression, asyncInit } = action || {};
    const assignState = (state) =>
      state.set(INITIAL, true).set("nextEmit", INITIAL);

    if (asyncInit) {
      setTimeout(()=>this.dispatch("impression"));
      return assignState(state);
    } else {
      // has customInitHandler
      setTimeout(() => {
        /**
         * Dispatch store parallel data.
         *
         * Need put it inside setTimeout,
         * to avoid conflict with first impression call.
         *
         */
        this.dispatch(assignState(state));

        setTimeout(() => {
          if (triggerImpression) {
            /**
             * Why need triggerImpression?
             * if u want let initDone call early, but maybe not dispatch impression soon.
             * u could pass triggerImpression to decide when call dispatch impression.
             */
            triggerImpression(() => this.dispatch("impression"));
          } else {
            this.dispatch("impression");
          }
        });
      });
      return state;
    }
  }

  processImpression(state, action) {
    return this.sendBeacon(state, action);
  }

  processAction(state, action) {
    const vpvid = state.get("vpvid");
    if (vpvid) {
      set(action, [PARAMS, "query", "vpvid"], vpvid);
    }
    return this.sendBeacon(state, action);
  }

  handleInit(state, action) {
    const customInitHandler = state.get("initHandler");
    const thisInitDone = this.initDone.bind(this);
    if (!customInitHandler) {
      action.asyncInit = true;
    }
    return callfunc(customInitHandler || thisInitDone, [
      state,
      action,
      thisInitDone,
    ]);
  }

  handleImpression(state, action) {
    const maybeAsyncRun = (state) => {
      const impressionHandler = state.get("impressionHandler");
      let next = callfunc(
        impressionHandler || this.processImpression.bind(this),
        [state, action]
      );
      const { stop } = getParams(action); // need locate after next
      if (!stop) {
        next = next.set("nextEmit", "impression");
      }
      return next;
    };
    if (!state.get(INITIAL)) {
      return this.handleInit(state, action);
    } else {
      const disableHandleImpression = state.get("disableHandleImpression");
      return disableHandleImpression ? state : maybeAsyncRun(state);
    }
  }

  handleAction(state, action) {
    const actionHandler = state.get("actionHandler");
    let next = callfunc(actionHandler || this.processAction.bind(this), [
      state,
      action,
    ]);
    const { wait, stop } = getParams(action); // need locate after next
    if (wait == null && !stop) {
      next = next.set("nextEmit", "action");
    }
    return next;
  }

  reduce(state, action) {
    if (state.get("nextEmit")) {
      state = state.set("nextEmit", null);
    }
    switch (action.type) {
      case "impression":
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

export default BaseI13nReducer;
