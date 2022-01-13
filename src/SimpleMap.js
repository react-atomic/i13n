import { toJS } from "get-object-value";

class SimpleMap {
  _state = {};

  constructor(obj) {
    if (obj) {
      this._state = obj;
    }
  }

  get(k) {
    return "object" === typeof this._state[k] && null !== this._state[k]
      ? new SimpleMap(this._state[k])
      : this._state[k];
  }

  set(k, v) {
    const state = {...this._state, [k]: toJS(v)};
    return new SimpleMap(state);
  }

  delete(k) {
    delete this._state[k];
    return new SimpleMap(this._state);
  }

  merge(arr) {
    this._state = {
      ...this._state,
      ...toJS(arr),
    };
    return new SimpleMap(this._state);
  }

  toJS() {
    return this._state;
  }
}

export default SimpleMap;
