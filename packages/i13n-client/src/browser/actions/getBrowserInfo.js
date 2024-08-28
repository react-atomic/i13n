// @ts-check

import { win, doc } from "win-doc";
import getCookie, { setCookie } from "get-cookie";
import getDocUrl, { getHostName } from "../actions/getDocUrl";
import { T_UNDEFINED } from "reshow-constant";
import get from "get-object-value";
import { toNum } from "to-percent-js";
import callfunc from "call-func";
import { isSameHost } from "../../libs/isSameHost";
import getRandomId from "get-random-id";

const MP_CLIENT_ID = "_ga";
const getClientIdCookie = (/**@type string*/key) => {
  const cookies = (getCookie(key || "") || "").split(".");
  if (cookies[2] && cookies[3]) {
    return cookies[2] + "." + cookies[3];
  }
};

export const getCookieClientId = () => {
  let c = getClientIdCookie(MP_CLIENT_ID);
  if (!c) {
    c = getRandomId();
    setCookie(MP_CLIENT_ID, "GA1.3." + c, 365 * 2);
  }
  return c;
};

/**
 * @typedef {object} ReferrerType
 * @property {string=} referrer
 */

/**
 * @param {ReferrerType&Object.<string,any>} [oDoc]
 */
export const getReferrer = (oDoc) => {
  const hostname = getHostName(oDoc);
  const referrer = get(oDoc, ["referrer"]);
  if (referrer && !isSameHost(hostname)(referrer)) {
    return {
      dr: referrer,
    };
  }
};

export const getBrowserMpInfo = () => {
  const oDoc = doc();
  const oWin = win();
  const nav = oWin.navigator;
  const screen = oWin.screen || { width: 0, height: 0, colorDepth: 0 };
  const docEl = oDoc.documentElement;
  const vw = Math.max(docEl?.clientWidth || 0, oWin.innerWidth || 0);
  const vh = Math.max(docEl?.clientHeight || 0, oWin.innerHeight || 0);
  return {
    ...getReferrer(oDoc),
    dl: getDocUrl(oDoc, true),
    ul: (nav?.language || "").toLowerCase(),
    fbp: getCookie("_fbp") || T_UNDEFINED,
    fbc: getCookie("_fbc") || T_UNDEFINED,
    vp: `${vw}x${vh}`,
    je: toNum(callfunc(nav?.javaEnabled, null, nav)),
    de: oDoc.characterSet,
    dt: oDoc.title,
    sd: screen.colorDepth + "-bit",
    sr: `${screen.width}x${screen.height}`,
    _gid: getClientIdCookie("_gid"),
  };
};
