// @ts-check
import { toMap } from "get-object-value";
import { createReducer } from "reshow-flux-base";
import { SimpleMap } from "reshow-map";
import { BaseI13nReducer, i13nStoreReAssign } from "i13n";
import { clone } from "../libs/parseJson";

const oI13n = new BaseI13nReducer();
const [i13nReduceStore, i13nDispatch] = createReducer(
  oI13n.reduce.bind(oI13n),
  new SimpleMap()
);

/**
 * @param {SimpleMap} state
 * @param {object} jsObj
 */
const mergeMap = (state, jsObj) => state.merge(jsObj);
i13nStoreReAssign({
  oI13n,
  store: i13nReduceStore,
  i13nDispatch,
  mergeMap,
});

const i13nStore = {
  ...i13nReduceStore,
  getClone: (/**@type string*/ key) => {
    const data = toMap(i13nStore.getState().get(key));
    return clone(data);
  },
};

export { i13nStore, i13nDispatch, mergeMap };
