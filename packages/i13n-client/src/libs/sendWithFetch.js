//@ts-check

import { forEachMap } from "get-object-value";

/**
 * @param {string} url
 * @param {object} data
 */
export const sendWithFetch = async (url, data) => {
  console.log({ url, data });
  const myurl = new URL(url);
  forEachMap(
    data,
    /**
     * @param {any} v
     * @param {any} k
     */
    (v, k) => {
      myurl.searchParams.set(k, v);
    }
  );
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
  console.log("send.js", { headers: res.headers, ok: res.ok });
};
