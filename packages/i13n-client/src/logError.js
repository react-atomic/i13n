import get from 'get-object-value';
import {i13nDispatch} from 'i13n';
import {getLastScript} from 'exec-script';
import {doc} from 'win-doc';

let debugFlag = false;

const logError = (error, action, name) => {
  let {message, stack} = error || {};
  stack = get(error, ['stack'], '').split(/\n/);
  const wait = action && -1 !== action.indexOf('I13nScript') ? 0 : undefined;
  const label = {
    message,
    stack,
    url: doc().URL,
    lastExec: getLastScript(),
  };
  if (name) {
    label.name = name;
  }
  i13nDispatch('action', {
    wait,
    I13N: {
      action,
      category: 'Error',
      label,
    },
  });
  if (debugFlag) {
    throw error;
  }
};

const setDebugFlag = bool => (debugFlag = bool);

export default logError;
export {setDebugFlag};
