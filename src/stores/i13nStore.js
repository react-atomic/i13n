import { toJS } from "get-object-value";
import BaseI13nStore from "../stores/BaseI13nStore";
import { createReducer } from "reshow-flux-base";

class Map {
  _state = {};

  constructor(obj) {
    if (obj) {
      this._state = obj;
    }
  }

  get(k) {
    return "object" === typeof this._state[k] && null !== this._state[k]
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

const oI13n = new BaseI13nStore();
const [store, i13nDispatch] = createReducer(
  oI13n.reduce.bind(oI13n),
  new Map()
);

oI13n.store = store;
oI13n.dispatch = i13nDispatch;
oI13n.mergeMap = (state, jsArr) => {
  return state.merge(jsArr);
};
store.i13n = oI13n;

export default store;
export { i13nDispatch };
