import setUrl from "seturl";
import { win, hasWin } from "win-doc";
import get from "get-object-value";
import callfunc from "call-func";

const GET = "GET";
const POST = "POST";
const keys = Object.keys;
const timeout = 30000;
let first;

// https://humanwhocodes.com/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing
const createCORSRequest = (method, url) => {
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

const req = (url, callback, method, query) => {
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

const imageTag = (url) => {
  if (!hasWin()) {
    return req(url);
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

const beaconApi = (url, query) => {
  const oSendBeacon = get(win(), ["navigator", "sendBeacon"]);
  if (!oSendBeacon || !first) {
    return false;
  }
  oSendBeacon.call(win().navigator, url, query);
  return true;
};

const dataToQuery = (data) => {
  let url = "?";
  if (!data) {
    return url;
  }
  keys(data).forEach((key) => {
    url = setUrl(key, data[key], url);
  });
  return url.substring(2);
};

const beacon = (url, data, ajaxReq, imgTag) => {
  ajaxReq = ajaxReq || req;
  imgTag = imgTag || imageTag;
  const query = dataToQuery(data);
  const GET_URL = url + "?" + query;
  if (2036 >= GET_URL.length) {
    imgTag(GET_URL);
  } else {
    beaconApi(url, query) || ajaxReq(url, null, POST, query) || imgTag(GET_URL);
  }
};

const setFirst = (bool) => (first = bool);

export default req;
export { beacon, setFirst };
