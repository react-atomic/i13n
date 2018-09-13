import BaseI13nStore from './BaseI13nStore'
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

class I13nStore extends BaseI13nStore
{
  getInitialState() {
      return new Map();
  }
}

// Export a singleton instance of the store, could do this some other way if
// you want to avoid singletons.
const instance = new I13nStore(dispatcher);
export default instance;
