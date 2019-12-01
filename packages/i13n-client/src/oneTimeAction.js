import get from 'get-object-value';
import lazyAttr from './lazyAttr';

const oneTimeAction = (I13N, state) => {
  const oneTimeActions = state && state.get('oneTime');
  const action = get(I13N, ['action']);
  if (action && oneTimeActions && oneTimeActions.length) {
    const storeOneTime = lazyAttr('oneTime');
    const arrOneTime = storeOneTime() || {};
    if (arrOneTime[action]) {
      return false;
    }
    if (-1 !== oneTimeActions.indexOf(action)) {
      arrOneTime[action] = true;
      storeOneTime(arrOneTime);
    }
  }
  return I13N;
};

export default oneTimeAction;
