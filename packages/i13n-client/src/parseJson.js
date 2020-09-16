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

const clone = (o) => oJSON.parse(oJSON.stringify(o));

export default parseJson;
export { clone };
