//@ts-check

import { KEYS } from "reshow-constant";
import callfunc from "call-func";

import { getParams, setParams } from "../getParams";
const INITIAL = "init";

/**
 * @template StateType
 * @template ActionType
 * @typedef {import("reshow-flux-base").StoreObject<StateType, ActionType>} StoreObject
 */

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

class BaseI13nReducer {
  /**
   * @abstract
   * @type {StoreObject<StateType, ActionObject>}
   */
  store;

  /**
   * @abstract
   * @param {StateType} _state
   * @param {object} _paramsMap
   */
  mergeMap(_state, _paramsMap) {}

  /**
   * @abstract
   * @template StateType
   * @template ActionType
   * @type {DispatchFunction<StateType, ActionType>}
   * @returns {any}
   */
  dispatch(_action, _actionParams) {}

  /**
   * @param {StateType} state
   * @param {ActionObject} _action
   */
  sendBeacon(state, _action) {
    return state;
  }

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
  initDone(state, action) {
    const { triggerImpression, asyncInit } = getParams(action);
    const assignState = (/**@type StateType*/ state) =>
      state.set(INITIAL, true).set("nextEmit", INITIAL);

    if (asyncInit) {
      setTimeout(() => this.dispatch("impression"));
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

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
  processImpression(state, action) {
    return this.sendBeacon(state, action);
  }

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
  processAction(state, action) {
    const vpvid = state.get("vpvid");
    if (vpvid) {
      setParams(action, ["query", "vpvid"], vpvid);
    }
    return this.sendBeacon(state, action);
  }

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
  handleInit(state, action) {
    const customInitHandler = state.get("initHandler");
    const thisInitDone = this.initDone.bind(this);
    if (!customInitHandler) {
      setParams(action, ["asyncInit"], true);
    }
    return callfunc(customInitHandler || thisInitDone, [
      state,
      action,
      thisInitDone,
    ]);
  }

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
  handleImpression(state, action) {
    const maybeAsyncRun = (/**@type StateType*/ state) => {
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

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
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

  /**
   * @param {StateType} state
   * @param {ActionObject} action
   */
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
        if (null != action.type && 1 === KEYS(action).length) {
          return this.handleAction(state, {
            type: "action",
            params: { I13N: { action: action.type } },
          });
        } else {
          return KEYS(action).length ? this.mergeMap(state, action) : state;
        }
    }
  }
}

export default BaseI13nReducer;
