//@ts-check

import callfunc from "call-func";
import { forEachMap } from "get-object-value";

let CurrentSendUtil;

/**
 * @param {function} sendUtil
 */
export const setupSend = (sendUtil) => {
  CurrentSendUtil = sendUtil;
};

/**
 * @param {string} url
 * @param {object} data
 */
const defaultSendUtil = async (url, data) => {
  console.log({ url, data });
  const myurl = new URL(url);
  forEachMap(data, (v, k) => {
    myurl.searchParams.set(k, v);
  });
  let res = await fetch(myurl, {
    method: "POST",
  });
  /*
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  });
  */
  console.log("send.js", { headers: await res.headers, ok: res.ok });
};

/**
 * @param {string} url
 * @param {object} data
 */
export default function send(url, data) {
  callfunc(CurrentSendUtil || defaultSendUtil, [url, data]);
}
