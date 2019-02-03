import setUrl from 'seturl';
import {win} from 'win-doc';

const GET = 'GET';
const POST = 'POST';
const keys = Object.keys;

const req = (url, callback, type, query) => {
  if (!type) {
    type = GET;
  }
  const request =
    'undefined' !== typeof XDomainRequest ? XDomainRequest : XMLHttpRequest;
  const oReq = new request();
  if ('function' === typeof callback) {
    oReq.onload = callback(oReq);
  }
  oReq.open(type, url);
  oReq.send(query);
};

const beaconApi = (url, query) => {
  const oSendBeacon = win().navigator.sendBeacon;
  if (!oSendBeacon) {
    return false;
  }
  oSendBeacon(url, query);
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

const beacon = (url, data, ajax) => {
  if (!ajax) {
    ajax = req;
  }
  const query = dataToQuery(data);
  const type = 2036 >= query.length ? GET : POST;
  beaconApi(url, query) || ajax(url, null, type, query);
};

export default req;
export {beacon};
