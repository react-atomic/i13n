import callfunc from "call-func";
import { getTimestamp } from "get-random-id";

const expireCallback = (createTime, expire, run, expireCb) => {
  const now = getTimestamp();
  const myExpire = expire || 0;
  let isUpToDate = false;
  if (null != createTime && !isNaN(createTime)) {
    if (now - createTime <= myExpire) {
      isUpToDate = true;
    }
  }
  return isUpToDate ? callfunc(run) : callfunc(expireCb);
};

export default expireCallback;
