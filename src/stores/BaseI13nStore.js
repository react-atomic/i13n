import {Store} from 'reshow-flux-base';
import get from 'get-object-value';
import set from 'set-object-value';

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

  handleAction(state, action) {
    let actionHandler = state.get('actionHandler');
    if (!actionHandler) {
      actionHandler = this.processAction.bind(this);
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
        return initCallback(nextState => run(nextState.set('init', true)));
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
      case 'config/reset':
        return this.getInitialState();
      default:
        return state;
    }
  }
}

export default BaseI13nStore;
