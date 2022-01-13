import { toJS } from "get-object-value";
import { createReducer } from "reshow-flux-base";

import BaseI13nStore from "../stores/BaseI13nStore";
import SimpleMap from "../SimpleMap";
import i13nStoreReAssign from "../i13nStoreReAssign";

const oI13n = new BaseI13nStore();
const [i13nStore, i13nDispatch] = createReducer(
  oI13n.reduce.bind(oI13n),
  new SimpleMap()
);

i13nStoreReAssign({
  oI13n,
  store: i13nStore,
  i13nDispatch,
  mergeMap: (state, jsArr) => state.merge(jsArr),
});

export { i13nStore, i13nDispatch, i13nStoreReAssign };
