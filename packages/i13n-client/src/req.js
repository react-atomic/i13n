import setUrl from 'seturl';
import {win} from 'win-doc';
import get from 'get-object-value';
import {UNDEFINED, FUNCTION} from 'reshow-constant';

const GET = 'GET';
const POST = 'POST';
const keys = Object.keys;

const req = (url, callback, type, query) => {
  if (!type) {
    type = GET;
  }
  const w = win();
  const request =
    UNDEFINED !== typeof w.XDomainRequest ? w.XDomainRequest : w.XMLHttpRequest;
  if (!request) {
    return false;
  }
  const oReq = new request();
  if (FUNCTION === typeof callback) {
    oReq.onload = callback(oReq);
  }
  oReq.open(type, url);
  oReq.send(query);
  return true;
};

const imageTag = url => (new Image().src = url);

const beaconApi = (url, query) => {
  const navigator = get(win(), ['navigator'], {});
  const oSendBeacon = navigator.sendBeacon;
  if (!oSendBeacon) {
    return false;
  }
  oSendBeacon.call(navigator, url, query);
  return true;
};

const dataToQuery = data => {
  let url = '?';
  if (!data) {
    return url;
  }
  keys(data).forEach(key => {
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
  const getUrl = thisUrl + '?' + query;
  if (2036 >= getUrl.length) {
    imgTag(getUrl);
  } else {
    beaconApi(url, query) || ajax(thisUrl, null, POST, query) || imgTag(getUrl);
  }
};

export default req;
export {beacon};
