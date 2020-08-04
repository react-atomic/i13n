import { queryFrom } from "css-query-selector";
import get from "get-object-value";
import getElValue from "./getElValue";

const getOptionEl = (sel) =>
  queryFrom(sel).one("option[value='" + getElValue(sel) + "']");

const getOptionText = (sel) => get(getOptionEl(sel), ["text"], "");

export default getOptionText;
export { getOptionEl };
