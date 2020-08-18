import logError from "./logError";
import {SCRIPT_ERROR} from "./execScript";

const parseJson = (strJson) => {
  try {
    return JSON.parse(strJson);
  } catch (e) {
    logError(e, SCRIPT_ERROR);
  }
};
export default parseJson;
