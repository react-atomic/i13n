import { toMap } from "get-object-value";
import { UNDEFINED } from "reshow-constant";
import { getTimestamp, expireCallback } from "get-random-id";

import { sStore } from "../stores/storage";

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

  const createTime = expireArr[key] || 0;
  const userExpire = expireSec ? expireSec * 1000 : null;

  return expireCallback(createTime, userExpire, () => arr[key]);
};

export default lazyAttr;
