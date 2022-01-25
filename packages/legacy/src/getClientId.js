import getCookie, { setCookie } from "get-cookie";
import getRandomId from "get-random-id";

import shopify from "./shopify";

const MP_CLIENT_ID = "_ga";

const getClientIdCookie = (key) => {
  const cookies = (getCookie(key || "") || "").split(".");
  if (cookies[2] && cookies[3]) {
    return cookies[2] + "." + cookies[3];
  }
};

const getCookieClientId = () => {
  let c = getClientIdCookie(MP_CLIENT_ID);
  if (!c) {
    c = getRandomId();
    setCookie(MP_CLIENT_ID, "GA1.3." + c, 365 * 2);
  }
  return c;
};

const getClientId = () => shopify.getClientId() || getCookieClientId();

export default getClientId;

export { getClientIdCookie, MP_CLIENT_ID };
