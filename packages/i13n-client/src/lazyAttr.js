import { toMap } from "get-object-value";
import { UNDEFINED } from "reshow-constant";
import { getTimestamp } from "get-random-id";
import { sStore } from "./storage";
import expireCallback from "./expireCallback";

const lazyKey = "i13nLazyAttr";
const expireKey = "i13nLazyExpire";

const lazyAttr = (key, expireSec) => (value) => {
  const arr = toMap(sStore.get(lazyKey));
  if (UNDEFINED === typeof key) {
    return arr;
  }
  const expireArr = toMap(sStore.get(expireKey));
  const now = getTimestamp();
  if (UNDEFINED !== typeof value) {
    arr[key] = value;
    expireArr[key] = now;
    sStore.set(lazyKey, arr);
    sStore.set(expireKey, expireArr);
  }
  const createTime = expireArr[key];
  const userExpire = (expireSec ?? createTime) * 1000;
  return expireCallback(createTime, userExpire, () => arr[key]);
};

export default lazyAttr;
