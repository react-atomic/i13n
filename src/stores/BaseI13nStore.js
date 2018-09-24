import {Store} from 'reshow-flux-base';
import get from 'get-object-value';
import set from 'set-object-value';
import {localStorage, Storage} from 'get-storage';

import {i13nDispatch} from '../i13nDispatcher';
import getTime from '../getTime';

const lStore = new Storage(localStorage);
const docUrl = () => document.URL;
const isArray = Array.isArray;

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

  pushLazyAction(action) {
    if (get(action, ['params', 'lazy'])) {
      delete action.params.lazy;
    }
    set(action, ['params', 'lazeInfo'], {
      from: docUrl(),
      time: getTime().toString(),
    });
    let lazyAction = lStore.get('lazyAction');
    if (!isArray(lazyAction)) {
      lazyAction = [];
    }
    lazyAction.push(action);
    lStore.set('lazyAction', lazyAction);
  }

  handleAction(state, action) {
    let actionHandler = state.get('actionHandler');
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
    }
    if (!get(action, ['params', 'stop'])) {
      this.nextEmits.push('action');
    }
    return actionHandler(state, action);
  }

  handleInit(state, action) {
    const initHandler = state.get('initHandler');
    if ('function' === typeof initHandler) {
      return initHandler(state, action);
    } else {
      return state;
    }
  }

  handleAfterInit(state) {
    this.nextEmits.push('init');
    const lazyAction = lStore.get('lazyAction');
    if (lazyAction && lazyAction.length) {
      lazyAction.forEach(action => this.handleAction(state, action));
    }
    lStore.set('lazyAction', []);
  }

  handleImpression(state, action) {
    state = state.set('lastUrl', docUrl());
    const run = state => {
      let impressionHandler = state.get('impressionHandler');
      if (!impressionHandler) {
        impressionHandler = this.processView.bind(this);
      }
      if (!get(action, ['params', 'stop'])) {
        this.nextEmits.push('impression');
      }
      return impressionHandler(state, action);
    };
    const init = state.get('init');
    if (!init) {
      const initCallback = this.handleInit(state, action);
      if ('function' === typeof initCallback) {
        return initCallback(nextState => {
          this.handleAfterInit(nextState);
          nextState = run(nextState.set('init', true));
          i13nDispatch('config/set', nextState.toJS());
        });
      } else {
        this.handleAfterInit(initCallback);
        return run(initCallback.set('init', true));
      }
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
