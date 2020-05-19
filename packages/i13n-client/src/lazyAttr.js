import { toMap } from "get-object-value";
import { UNDEFINED } from "reshow-constant";
import { sStore } from "./storage";

const lazyKey = "i13nLazyAttr";
const expireKey = "i13nLazyExpire";

const lazyAttr = (key, expireSec) => value => {
  const arr = toMap(sStore.get(lazyKey));
  if (UNDEFINED === typeof key) {
    return arr;
  }
  const expireArr = toMap(sStore.get(expireKey));
  const now = new Date().getTime();
  if (UNDEFINED !== typeof value) {
    arr[key] = value;
    expireArr[key] = now;
    sStore.set(lazyKey, arr);
    sStore.set(expireKey, expireArr);
  }
  const createTime = expireArr[key];
  const userExpire = expireSec * 1000;
  let isUpToDate = true;
  if (!isNaN(userExpire) && !isNaN(createTime)) {
    if (now - createTime >= userExpire) {
      isUpToDate = false;
    }
  }
  if (isUpToDate) {
    return arr[key];
  }
};

export default lazyAttr;
