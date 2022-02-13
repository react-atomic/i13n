import { i13nStore } from "i13n-store";
import exec from "exec-script";
import logError, {SCRIPT_ERROR} from "../libs/logError";

const execScript = (scriptName) => {
  const scriptCode = i13nStore.getState().get("script")?.get(scriptName);
  if (scriptCode) {
    exec(scriptCode, null, null, (e) => {
      logError(e, SCRIPT_ERROR, scriptName);
    });
  } else {
    console.warn("Script: [" + scriptName + "] not found.");
  }
};

export default execScript;
