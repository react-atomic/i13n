import { toJS, toMap } from "get-object-value";
import { createReducer, SimpleMap } from "reshow-flux-base";
import { BaseI13nReducer, i13nStoreReAssign } from "i13n";
import { clone } from "../libs/parseJson";

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

i13nStore.getClone = (key) => {
  const data = toMap(i13nStore.getState().get(key));
  return clone(data);
};

export { i13nStore, i13nDispatch, mergeMap };
