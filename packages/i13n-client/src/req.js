import setUrl from "seturl";
import { win } from "win-doc";
import get from "get-object-value";
import callfunc from "call-func";

const GET = "GET";
const POST = "POST";
const keys = Object.keys;
const timeout = 10000;
let first;

// https://humanwhocodes.com/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing
const createCORSRequest = (method, url) => {
  const w = win();
  method = method || GET;
  let xhr = w.XMLHttpRequest != null ? new w.XMLHttpRequest() : null;
  if (xhr && "withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (w.XDomainRequest != null) {
    xhr = new w.XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

const req = (url, callback, type, query) => {
  const oReq = createCORSRequest(type, url);
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

const beacon = (url, data, ajax, imgTag) => {
  if (!ajax) {
    ajax = req;
  }
  if (!imgTag) {
    imgTag = imageTag;
  }
  const thisUrl = url;
  const query = dataToQuery(data);
  const getUrl = thisUrl + "?" + query;
  if (2036 >= getUrl.length) {
    imgTag(getUrl);
  } else {
    beaconApi(url, query) || ajax(thisUrl, null, POST, query) || imgTag(getUrl);
  }
};

const setFirst = (bool) => (first = bool);

export default req;
export { beacon, setFirst };
