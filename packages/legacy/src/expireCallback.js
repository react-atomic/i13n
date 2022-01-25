import callfunc from "call-func";
import { getTimestamp } from "get-random-id";

const expireCallback = (createTime, expire, run, expireCb) => {
  const now = getTimestamp();
  let isUpToDate = false;
  if (null != createTime && !isNaN(createTime)) {
    if (!expire || now - createTime <= expire) {
      isUpToDate = true;
    }
  }
  return isUpToDate ? callfunc(run) : callfunc(expireCb);
};

export default expireCallback;
