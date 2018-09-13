const req = (url, callback) =>
{
  const oReq = new XMLHttpRequest()
  oReq.onload = callback(oReq)
  oReq.open("GET", url)
  oReq.send()
}

export default req
