const i13nStoreReAssign = ({ oI13n, store, i13nDispatch, mergeMap }) => {
  oI13n.store = store;
  oI13n.dispatch = i13nDispatch;
  oI13n.mergeMap = mergeMap;
  store.i13n = oI13n;
};

export default i13nStoreReAssign;
