import { win } from "win-doc";
import get from "get-object-value";
import { getUrl } from "seturl";

const getDocUrl = () => {
  const url = get(win(), ["__st", "pageurl"]);
  if (url) {
    return "https://" + url;
  }
};

const getUid = () => {
  const uid = get(win(), ["__st", "cid"]);
  return uid;
};

const getGaId = () => {
  const url = getDocUrl();
  const ga = getUrl("_ga", url) || "";
  return get(ga.split("-"), [1]);
};

const getClientId = () => {
  const token = get(win(), ["Shopify", "Checkout", "token"]);
  if (token) {
    return "shopify-checkout-" + token;
  }
};

const shopify = {
  getUid,
  getGaId,
  getDocUrl,
  getClientId
};

export default shopify;
