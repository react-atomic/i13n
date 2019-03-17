import get from 'get-object-value';
import {i13nDispatch} from 'i13n';

let debugFlag = false;

const logError = (error, action) => {
  let {message, stack} = error;
  stack = get(error, ['stack'], '').split(/\n/);
  i13nDispatch('action', {
    wait: 0,
    I13N: {
      action,
      category: 'Error',
      label: {
        message,
        stack,
        url: doc().URL,
        lastExec: getLastScript(),
      },
    },
  });
  if (debugFlag) {
    throw error;
  }
};

const setDebugFlag = bool => (debugFlag = bool);

export default logError;
export {setDebugFlag};
