import setUrl from "seturl";
import { win } from "win-doc";
import get from "get-object-value";
import { FUNCTION } from "reshow-constant";

const GET = "GET";
const POST = "POST";
const keys = Object.keys;

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
  const oReq = createCORSRequest(url, type);
  if (!oReq) {
    return false;
  }
  if (FUNCTION === typeof callback) {
    oReq.onload = callback(oReq);
  }
  try {
    oReq.send(query);
    return true;
  } catch (e) {
    console.warn("req failed.", { url, e });
    return false;
  }
};

const imageTag = (url) => (new Image().src = url);

const beaconApi = (url, query) => {
  const navigator = get(win(), ["navigator"], {});
  const oSendBeacon = navigator.sendBeacon;
  if (!oSendBeacon) {
    return false;
  }
  oSendBeacon.call(navigator, url, query);
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

export default req;
export { beacon };
