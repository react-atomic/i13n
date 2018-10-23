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
const getParams = action => get(action, [PARAMS], {});

class BaseI13nStore extends Store {
  sendBeacon(state, action) {
    return state;
  }

  processAction(state, action) {
    const vpvid = state.get('vpvid');
    if (vpvid) {
      set(action, [PARAMS, 'query', 'vpvid'], vpvid);
    }
    return this.sendBeacon(state, action);
  }

  processView(state, action) {
    state = this.sendBeacon(state, action);
    return state;
  }

  pushLazyAction(action, key) {
    const {...params} = getParams(action);
    const thisAction = {params, type: action.type};
    set(thisAction, [PARAMS, 'lazeInfo'], {
      from: docUrl(),
      time: getTime().toString(),
    });
    const lazyAction = this.getLazy();
    if (key) {
      set(lazyAction, ['__hash', key], thisAction);
    } else {
      set(lazyAction, ['__seq'], thisAction, true);
    }
    lStore.set('lazyAction', lazyAction);
  }

  mergeWithLazy(action, key) {
    const lazyAction = this.getLazy();
    const {stop, wait, lazeInfo, ...lazeParams} = get(
      lazyAction,
      ['__hash', key, PARAMS],
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
    delete lazyAction.__hash[key];
    lStore.set('lazyAction', lazyAction);
    delete action.params.withLazy;
    return action;
  }

  getLazy(key) {
    let lazyAction = lStore.get('lazyAction');
    if ('object' !== typeof lazyAction) {
      lazyAction = {};
    }
    return 'undefined' === typeof key ? lazyAction : lazyAction.__hash[key];
  }

  handleAction(state, action) {
    let actionHandler = state.get('actionHandler');
    const {withLazy} = getParams(action);
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
    }
    if (withLazy) {
      action = this.mergeWithLazy(action, withLazy);
    }
    const next = actionHandler(state, action);
    const {wait, stop} = getParams(action); // need locate after next
    if ('undefined' === typeof wait && !stop) {
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
    const lazyAction = this.getLazy();
    if (lazyAction) {
      const handleLazy = (lazeArr, key) => {
        const laze = lazeArr[key];
        let {wait, stop} = getParams(laze);
        if (!wait || wait <= 0) {
          if (!stop) {
            if ('undefined' !== typeof get(laze, ['params', 'wait'])) {
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

      let seq = get(lazyAction, ['__seq']);
      if (isArray(seq)) {
        lazyAction.__seq = seq.filter((action, key) => handleLazy(seq, key));
      }

      const hash = get(lazyAction, ['__hash']);
      if (hash) {
        keys(hash).forEach(key => handleLazy(hash, key));
      }

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
      const {wait, stop} = getParams(action); // need locate after next
      if ('undefined' === typeof wait && !stop) {
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
        return this.reset();
      default:
        return !!keys(action).length ? state.merge(action) : state;
    }
  }
}

export default BaseI13nStore;
