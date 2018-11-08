import {toJS} from 'get-object-value';
import BaseI13nStore from '../stores/BaseI13nStore';
import dispatcher from '../i13nDispatcher';

class Map {
  _state = {};

  constructor(obj) {
    if (obj) {
      this._state = obj;
    }
  }

  get(k) {
    return 'object' === typeof this._state[k] && null !== this._state[k]
      ? new Map(this._state[k])
      : this._state[k];
  }

  set(k, v) {
    this._state[k] = toJS(v);
    return new Map(this._state);
  }

  delete(k) {
    delete this._state[k];
    return new Map(this._state);
  }

  merge(arr) {
    this._state = {
      ...this._state,
      ...toJS(arr),
    };
    return new Map(this._state);
  }

  toJS() {
    return this._state;
  }
}

class I13nStore extends BaseI13nStore {
  getInitialState() {
    return new Map();
  }

  handleEmit(state, action) {
    const on = get(action, [PARAMS]);
    this.nextEmits.push(on);
    return state;
  }

  handleRegister(state, action) {
    const {func, on, mod} = get(action, [PARAMS]);
    switch (mod) {
      case 'remove':
        this.removeListener(func, on);
        break;
      case 'add':
      default:
        this.addListener(func, on);
        break;
    }
    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'emit':
        return this.handleEmit(state, action);
      case 'register':
        return this.handleRegister(state, action);
      default:
        return super.reduce(state, action);
    }
  }
}

// Export a singleton instance of the store, could do this some other way if
// you want to avoid singletons.
const instance = new I13nStore(dispatcher);
export default instance;
