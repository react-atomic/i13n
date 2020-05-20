import callfunc from "call-func";
import getTimestamp from "./getTimestamp";

const expireCallback = (createTime, expire, run, expireCb) => {
  const now = getTimestamp();
  let isUpToDate = true;
  if (!isNaN(expire) && !isNaN(createTime)) {
    if (now - createTime >= expire) {
      isUpToDate = false;
    }
  }
  return isUpToDate ? callfunc(run) : callfunc(expireCb);
};

export default expireCallback;
