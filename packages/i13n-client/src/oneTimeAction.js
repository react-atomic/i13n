import lazyAttr from './lazyAttr';

const ONE_TIME_ACTION = 'oneTimeAction';

const oneTimeAction = (I13N, state) => {
  const oneTimeActions = state && state.get(ONE_TIME_ACTION);
  const action = I13N && I13N.action;
  if (action && oneTimeActions && oneTimeActions.length) {
    const storeOneTime = lazyAttr(ONE_TIME_ACTION);
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
