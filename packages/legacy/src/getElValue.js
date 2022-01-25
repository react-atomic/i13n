import get from "get-object-value";
import query, { queryFrom } from "css-query-selector";
import getNum from "./getNum";

const getElValue = (el, from) => {
  let q = query;
  if (from) {
    q = queryFrom(from);
  }
  return get(q.el(el), ["value"]);
};

const getElNumValue = (el, from) => getNum(getElValue(el, from));

export default getElValue;
export { getElNumValue };
