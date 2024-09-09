// @ts-check
import { removeEmpty } from "array.merge";
import { getNum } from "to-percent-js";
import { UNDEFINED } from "reshow-constant";
import getRandomId, { getTimestamp } from "get-random-id";

// lib
import parseJson from "../libs/parseJson";
import { ERROR_CATEGORY } from "../libs/logError";

// action
import getStartTime from "../actions/startTime";
import getClientId from "../actions/getClientId";

/**
 * @param {number=} v
 */
const notUndefinedNum = (v) => (UNDEFINED !== typeof v ? getNum(v) : v);

class DataLayerToMp {
  /**
   * @param {object} config
   */
  getActionData(config) {
    const { action, category, label, value } = config || {};
    const data = {
      ec: category,
      ea: action,
      el: label,
      ev: notUndefinedNum(value),
    };
    return data;
  }

  getMp(props, data) {
    const { trackingId, needTrackingId, version, userId, userIp, userCountry } =
      props || {};
    if (needTrackingId && trackingId == null) {
      return false;
    }
    const {
      trigger,
      bCookieIndex,
      bCookie,
      lazeInfoIndex,
      lazeInfo,
      p,
      p2,
      p3,
      p4,
      p5,
    } = data || {};
    /***
     * @type any
     */
    const d = {
      ...this.getActionData(data),
      cg1: p,
      cg2: p2,
      cg3: p3,
      cg4: p4,
      cg5: p5,
      // <-- GA4 Ready -->
      _s: seq,
      tid: trackingId,
      cid: getClientId(),
      v: version || 2, //version
      sid: pvid,
      seg: 1,
      // <-- GBA TEST -->
      _dbg: 1,
      uid: userId,
      _uip: userIp,
      _uc: userCountry,
      en: "impression" === trigger ? "page_view" : "event",
    };
    seq++;
    if (ERROR_CATEGORY === d.ec) {
      d.t = "exception";
      d.exd = d.ea;
    }
    if (bCookie) {
      if (bCookieIndex) {
        d["cd" + bCookieIndex] = bCookie;
      }
      d.uid = bCookie;
    }
    if (lazeInfo) {
      if (lazeInfoIndex) {
        d["cd" + lazeInfoIndex] = lazeInfo;
      }
      const oLazyInfo = parseJson(lazeInfo);
      if (oLazyInfo.time) {
        const past = getTimestamp(oLazyInfo.time);
        if (!isNaN(past)) {
          d.qt = getTimestamp() - past;
        }
      }
    }
    const startTime = getStartTime();
    if (startTime) {
      d.tfd = getTimestamp() - startTime;
    }
    return removeEmpty(d, true);
  }
}

let seq;
let pvid;
/**
 * @param {number} i
 */
export const resetSeq = (i = 1) => {
  seq = i;
  pvid = getRandomId();
};
resetSeq();

export default DataLayerToMp;
