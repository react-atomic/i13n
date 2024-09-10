// @ts-check
import { removeEmpty } from "array.merge";
import { getNum } from "to-percent-js";
import { UNDEFINED, KEYS } from "reshow-constant";
import getRandomId, { getTimestamp } from "get-random-id";

// action
import getStartTime from "../actions/startTime";
import getClientId from "../actions/getClientId";

/**
 * @param {number=} v
 */
const notUndefinedNum = (v) => (UNDEFINED !== typeof v ? getNum(v) : v);

class DataLayerToMp {
  /**
   * @see https://support.google.com/analytics/answer/14240153?hl=en
   * @param {object} beaconOption
   */
  getActionData(beaconOption) {
    const { labels = {}, metrics = {} } = beaconOption || {};
    let result = {};
    KEYS(labels).forEach((/**@type string*/ key) => {
      result[`ep.${key}`] = labels[key];
    });
    KEYS(metrics).forEach((/**@type string*/ key) => {
      result[`epn.${key}`] = notUndefinedNum(metrics[key]);
    });
    return result;
  }

  /**
   *
   * @param {object} internalProps
   * @param {object} beaconOption
   */
  getMp(internalProps, beaconOption) {
    const {
      trackingId,
      needTrackingId,
      version,
      userId,
      userIp,
      userCountry,
      debug,
    } = internalProps || {};
    if (needTrackingId && trackingId == null) {
      return false;
    }
    const { action, trigger, deferredAction, p, p2, p3, p4, p5 } =
      beaconOption || {};
    /***
     * @type any
     */
    const d = {
      ...this.getActionData(beaconOption),
      "ep.content_group": p,
      "ep.content_group2": p2,
      "ep.content_group3": p3,
      "ep.content_group4": p4,
      "ep.content_group5": p5,
      // <-- User Data -->
      uid: userId,
      _uip: userIp,
      "ep.user_country": userCountry,
      // <-- GA4 Ready -->
      _s: seq,
      tid: trackingId,
      cid: getClientId(),
      v: version || 2, //version
      sid: pvid,
      seg: 1,
      en: "impression" === trigger ? "page_view" : (action ?? "event"),
      // <-- GBA TEST (set debug to 1)-->
      _dbg: debug,
    };
    seq++;
    if (null != deferredAction) {
      d["ep.deferredAction"] = JSON.stringify(deferredAction);
      if (deferredAction.time) {
        const past = getTimestamp(deferredAction.time);
        if (!isNaN(past)) {
          d._et = getTimestamp() - past;
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
