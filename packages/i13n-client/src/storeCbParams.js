import { i13nDispatch } from "i13n";
import get from "get-object-value";

const _LAST_EVENT = "lastEvent";
const _I13N_CB_PARAMS = "i13nCbParams";

const storeCbParams = (params, e) => {
  const arr = {};
  if (params) {
    arr[_I13N_CB_PARAMS] = params;
  }
  if (e) {
    arr[_LAST_EVENT] = [e, get(e, ["currentTarget"])];
  }
  i13nDispatch(arr);
};

export default storeCbParams;
export { _LAST_EVENT, _I13N_CB_PARAMS };
