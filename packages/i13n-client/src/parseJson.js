import logError from "./logError";
import { SCRIPT_ERROR } from "./execScript";

const oJSON = JSON;

const parseJson = (strJson) => {
  try {
    return oJSON.parse(strJson);
  } catch (e) {
    logError(e, SCRIPT_ERROR);
  }
};

const clone = (o) => {
  try {
    return oJSON.parse(oJSON.stringify(o));
  } catch (e) {
    logError(e, SCRIPT_ERROR);
  }
};

export default parseJson;
export { clone };
