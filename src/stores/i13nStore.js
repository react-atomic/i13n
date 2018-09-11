import {Store} from 'reshow-flux-base';
import get from 'get-object-value';
import set from 'set-object-value';

import dispatcher from '../i13nDispatcher';

class Map {
  _state = {};

  constructor(obj) {
    if (obj) {
      this._state = obj;
    }
  }

  get(k) {
    return this._state[k];
  }

  set(k, v) {
    this._state[k] = v;
    return new Map(this._state);
  }

  merge(arr) {
    this._state = {
      ...this._state,
      ...arr,
    };
    return new Map(this._state);
  }
}

class I13nStore extends Store {
  getInitialState() {
    return new Map();
  }

  sendBeacon(state, action) {
    return state;
  }

  processAction(state, action) {
    const query = get(action, ['params', 'query'], {});
    query.vpvid = state.get('vpvid');
    if (!action.params) {
      action.params = {};
    }
    action.params.query = query;
    return this.sendBeacon(state, action);
  }

  processView(state, action) {
    state = this.sendBeacon(state, action);
    return state.set('lastUrl', document.URL);
  }

  handleAction(state, action) {
    let actionHandler = state.get('actionHandler');
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
    }
    const defaultActionCallback = state.get('defaultActionCallback');
    if ('function' === typeof defaultActionCallback) {
      const cb = get(action, ['params', 'callback']);
      if (!cb) {
        set(action, ['params', 'callback'], getDefaultActionCallback(state));
      }
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

  handleImpression(state, action) {
    state = state.set('lastUrl', document.URL);
    const run = state => {
      let impressionHandler = state.get('impressionHandler');
      if (!impressionHandler) {
        impressionHandler = this.processView.bind(this);
      }
      return impressionHandler(state, action);
    };
    const init = state.get('init');
    if (!init) {
      const initCallback = this.handleInit(state, action);
      if ('function' === typeof initCallback) {
        return initCallback(() => run(state.set('init', true)));
      } else {
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
      default:
        return state;
    }
  }
}

// Export a singleton instance of the store, could do this some other way if
// you want to avoid singletons.
const instance = new I13nStore(dispatcher);
export default instance;
