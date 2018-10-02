const req = (url, callback) => {
  const request = XDomainRequest ? XDomainRequest : XMLHttpRequest;
  const oReq = new request();
  oReq.onload = callback(oReq);
  oReq.open('GET', url);
  oReq.send();
};

export default req;
