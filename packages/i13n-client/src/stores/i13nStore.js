import { toJS } from "get-object-value";
import { createReducer, SimpleMap } from "reshow-flux-base";
import { BaseI13nReducer, i13nStoreReAssign } from "i13n";

const oI13n = new BaseI13nReducer();
const [i13nStore, i13nDispatch] = createReducer(
  oI13n.reduce.bind(oI13n),
  new SimpleMap()
);

const mergeMap = (state, jsArr) => state.merge(jsArr);
i13nStoreReAssign({
  oI13n,
  store: i13nStore,
  i13nDispatch,
  mergeMap,
});

export { i13nStore, i13nDispatch, mergeMap };
