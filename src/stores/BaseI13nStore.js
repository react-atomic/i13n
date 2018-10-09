import {Store} from 'reshow-flux-base';
import get from 'get-object-value';
import set from 'set-object-value';
import {localStorage, Storage} from 'get-storage';

import {i13nDispatch} from '../i13nDispatcher';
import getTime from '../getTime';

const lStore = new Storage(localStorage);
const docUrl = () => document.URL;
const isArray = Array.isArray;
const keys = Object.keys;
const PARAMS = 'params';

class BaseI13nStore extends Store {
  sendBeacon(state, action) {
    return state;
  }

  processAction(state, action) {
    set(action, [PARAMS, 'query', 'vpvid'], state.get('vpvid'));
    return this.sendBeacon(state, action);
  }

  processView(state, action) {
    state = this.sendBeacon(state, action);
    return state;
  }

  pushLazyAction(action, key) {
    const {stop, ...params} = get(action, [PARAMS], {});
    const thisAction = {params, type: action.type};
    set(thisAction, [PARAMS, 'lazeInfo'], {
      from: docUrl(),
      time: getTime().toString(),
    });
    let lazyAction = lStore.get('lazyAction');
    if ('object' !== typeof lazyAction) {
      lazyAction = {};
    }
    if (key) {
      lazyAction[key] = thisAction;
    } else {
      set(lazyAction, ['__seq'], thisAction, true);
    }
    lStore.set('lazyAction', lazyAction);
  }

  mergeWithLazy(action, key) {
    const lazyAction = lStore.get('lazyAction');
    const {stop, wait, waitToSend, lazeInfo, ...lazeParams} = get(
      lazyAction,
      [key, PARAMS],
      {},
    );
    keys(lazeParams).forEach(pKey => {
      const p = lazeParams[pKey];
      const newP =
        'object' === typeof p
          ? {...p, ...get(action, [PARAMS, pKey], {})}
          : get(action, [PARAMS, pKey], p);
      set(action, [PARAMS, pKey], newP);
    });
    delete lazyAction[key];
    lStore.set('lazyAction', lazyAction);
    delete action.params.withLazy;
    return action;
  }

  handleAction(state, action) {
    let actionHandler = state.get('actionHandler');
    const {stop, withLazy} = get(action, [PARAMS], {});
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
    }
    if (withLazy) {
      action = mergeWithLazy(action, withLazy);
    }
    const next = actionHandler(state, action);
    if (!stop) {
      this.nextEmits.push('action');
    }
    return next;
  }

  handleInit(state, action) {
    const initHandler = state.get('initHandler');
    if ('function' === typeof initHandler) {
      return initHandler(state, action, this.handleAfterInit);
    } else {
      return this.handleAfterInit(state);
    }
  }

  handleAfterInit = state => {
    this.nextEmits.push('init');
    state = state.set('init', true);
    i13nDispatch('config/set', state); // for async, need located before lazyAction
    const lazyAction = lStore.get('lazyAction');
    if (lazyAction) {
      const seq = get(lazyAction, ['__seq']);
      if (isArray(seq)) {
        seq.forEach(action => i13nDispatch(action));
      }
      delete lazyAction.__seq;
      keys(lazyAction).forEach(key => {
        const laze = lazyAction[key];
        const params = get(laze, [PARAMS], {});
        const {waitToSend} = params; 
        let {wait} = params;
        if (!wait || wait <= 0) {
          if (waitToSend || 'undefined' === typeof wait) {
            i13nDispatch(laze);
          }
          delete lazyAction[key];
        } else {
          laze.params.wait = --wait;
        }
      });
      lStore.set('lazyAction', lazyAction);
    }
    i13nDispatch('view');
    return state;
  };

  handleImpression(state, action) {
    state = state.set('lastUrl', docUrl());
    const run = state => {
      let impressionHandler = state.get('impressionHandler');
      if (!impressionHandler) {
        impressionHandler = this.processView.bind(this);
      }
      const next = impressionHandler(state, action);
      if (!get(action, [PARAMS, 'stop'])) {
        this.nextEmits.push('impression');
      }
      return next;
    };
    const init = state.get('init');
    if (!init) {
      return this.handleInit(state, action);
    } else {
      return run(state);
    }
  }

  reduce(state, action) {
    switch (action.type) {
      case 'action':
        return this.handleAction(state, action);
      case 'view':
        return this.handleImpression(state, action);
      case 'config/set':
        return state.merge(action.params);
      case 'config/reset':
        return this.getInitialState();
      default:
        return !!keys(action).length ? state.merge(action) : state;
    }
  }
}

export default BaseI13nStore;
