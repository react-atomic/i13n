// @ts-check

import { win, hasWin } from "win-doc";
import get from "get-object-value";
import callfunc from "call-func";
import { KEYS } from "reshow-constant";

const GET = "GET";
const POST = "POST";
const timeout = 30000;
let first;

// https://humanwhocodes.com/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing
/**
 * @param {string} method
 * @param {string} url
 */
const createCORSRequest = (method, url) => {
  /***
   * @type any
   */
  const g = win() || self;
  method = method || GET;
  let xhr = g.XMLHttpRequest != null ? new g.XMLHttpRequest() : null;
  if (xhr && "withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (g.XDomainRequest != null) {
    xhr = new g.XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

/**
 * @param {string} url
 * @param {?Function} [callback]
 * @param {string} method
 * @param {string} query
 */
const req = (url, callback, method = GET, query = "") => {
  const oReq = createCORSRequest(method, url);
  if (!oReq) {
    return false;
  }
  oReq.timeout = timeout;
  oReq.onload = () => {
    first = true;
    callfunc(callfunc(callback, [oReq]));
  };
  try {
    oReq.send(query);
    return true;
  } catch (e) {
    console.warn("req failed.", { url, e });
    return false;
  }
};

/**
 * @param {string} url
 */
const imageTag = (url) => {
  if (!hasWin()) {
    console.warn("req failed not use browser.", { url });
  }
  const oImg = new Image();
  let _timer;
  oImg.onload = () => {
    _timer && clearTimeout(_timer);
    first = true;
  };
  oImg.src = url;
  _timer = setTimeout(() => {
    oImg.src = "";
  }, timeout + 60000);
};

/**
 * @param {string} url
 * @param {string} query
 */
const beaconApi = (url, query) => {
  const oSendBeacon = get(win(), ["navigator", "sendBeacon"]);
  if (!oSendBeacon || !first) {
    return false;
  }
  oSendBeacon.call(win().navigator, url, query);
  return true;
};

/**
 * @param {Object<string, any>=} data
 */
const dataToQuery = (data) => {
  if (null == data) {
    return "?";
  } else {
    const o = new URLSearchParams();
    KEYS(data).forEach((key) => {
      o.set(key, data[key]);
    });
    return o.toString();
  }
};

/**
 * @param {string} url
 * @param {Object<string, any>=} data
 */
const beacon = (url, data, ajaxReq = req, imgTag = imageTag) => {
  const query = dataToQuery(data);
  const GET_URL = url + "?" + query;
  if (2036 >= GET_URL.length) {
    imgTag(GET_URL);
  } else {
    beaconApi(url, query) || ajaxReq(url, null, POST, query) || imgTag(GET_URL);
  }
};

const setFirst = (/**@type boolean*/ bool) => (first = bool);

export default req;
export { beacon, setFirst };
