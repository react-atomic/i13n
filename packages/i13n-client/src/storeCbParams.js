import {i13nDispatch} from 'i13n';
import get from 'get-object-value';

const _LAST_EVENT = 'lastEvent';
const _I13N_CB_PARAMS = 'i13nCbParams';

const storeCbParams = (params, e) => {
  i13nDispatch({
    [_LAST_EVENT]: [e, get(e, ['currentTarget'])],
    [_I13N_CB_PARAMS]: params,
  });
};

export default storeCbParams;
export {_LAST_EVENT, _I13N_CB_PARAMS};
