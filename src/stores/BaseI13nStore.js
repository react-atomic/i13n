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

class BaseI13nStore extends Store {
  sendBeacon(state, action) {
    return state;
  }

  processAction(state, action) {
    const query = get(action, ['params', 'query'], {});
    query.vpvid = state.get('vpvid');
    set(action, ['params', 'query'], query);
    return this.sendBeacon(state, action);
  }

  processView(state, action) {
    state = this.sendBeacon(state, action);
    return state;
  }

  pushLazyAction(action, key) {
    const {stop, ...params} = get(action, ['params'], {});
    const thisAction = {params};
    set(thisAction, ['params', 'lazeInfo'], {
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

  getWithLazy(action, key) {
    const lazyAction = lStore.get('lazyAction');
    const {stop, wait, ...lazeParams} = get(lazyAction, [key, 'params'], {});
    keys(lazeParams).forEach(pKey => {
      const p = lazeParams[pKey];
      action.params[pKey] = {
        ...p,
        ...action.params[pKey],
      };
    });
    delete lazyAction[key];
    lStore.set('lazyAction', lazyAction);
  }

  handleAction(state, action) {
    let actionHandler = state.get('actionHandler');
    const {stop, withLazy} = get(action, ['params'], {});
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
    }
    if (withLazy) {
      action = getWithLazy(action, withLazy);
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
      return initHandler(state, action);
    } else {
      return this.handleAfterInit(state);
    }
  }

  handleAfterInit = state => {
    const lazyAction = lStore.get('lazyAction');
    if (lazyAction) {
      const seq = get(lazyAction, ['__seq']);
      if (isArray(seq)) {
        seq.forEach(action => this.handleAction(state, action));
      }
      delete lazyAction.__seq;
      keys(lazyAction).forEach(key => {
        const laze = lazyAction[key];
        if (get(laze, ['wait'], 0) <= 0) {
          this.handleAction(state, laze);
          delete lazyAction[key];
        } else {
          laze.wait--;
        }
      });
      lStore.set('lazyAction', lazyAction);
    }
    this.nextEmits.push('init');
    state = state.set('init', true);
    i13nDispatch('config/set', state); // for async
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
      if (!get(action, ['params', 'stop'])) {
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
        return state;
    }
  }
}

export default BaseI13nStore;
