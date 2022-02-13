import get from "get-object-value";
import { getLastScript } from "exec-script";
import { doc } from "win-doc";

import { i13nDispatch } from "../stores/i13nStore";

let debugFlag = false;
let errorCount = 0;
const maxError = 5;
const SCRIPT_ERROR = "I13nScriptErr";

/**
 * @params error object Error object
 * @params action string Error type
 */
const logError = (error, action, name) => {
  if (errorCount === maxError) {
    console.log("Max Errors exceed.", maxError);
  } else if (errorCount > maxError) {
    return;
  }
  errorCount++;
  let { message, stack } = error || {};
  stack = get(error, ["stack"], "").split(/\n/);
  const lastExec = getLastScript();
  const label = {
    message,
    stack,
    url: doc().URL,
    lastExec,
  };
  if (name) {
    label.name = name;
  }
  setTimeout(() => {
    const wait = action && -1 !== action.indexOf(SCRIPT_ERROR) ? 0 : undefined;
    i13nDispatch("action", {
      wait,
      I13N: {
        action,
        category: "Error",
        label,
      },
    });
  });
  if (debugFlag) {
    console.error({ action, name }, lastExec);
    throw error;
  }
};

const setDebugFlag = (bool) => (debugFlag = bool);
const getDebugFlag = () => debugFlag;

export default logError;
export { setDebugFlag, getDebugFlag, SCRIPT_ERROR };
