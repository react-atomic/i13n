import { win } from "win-doc";
import get from "get-object-value";
import { getUrl } from "seturl";

const SHOPIFY = "Shopify";
const __ST = "__st";
const checkoutPath = [SHOPIFY, "Checkout"];
const thankYou = "thank_you";

const getStepName = () => {
  const stepName = get(win(), [...checkoutPath, "step"]);
  return stepName;
};

const getStepNo = () => {
  const stepName = getStepName();
  switch (stepName) {
    default:
      break;
    case "contact_information":
      return 1;
    case "shipping_method":
      return 2;
    case "payment_method":
      return 3;
  }
};

const getShopId = () => {
  const shop = get(win(), [SHOPIFY, "shop"], () =>
    get(win(), [...checkoutPath, "apiHost"])
  );
  return shop;
};

const getCurrency = () => {
  const currency = get(win(), [...checkoutPath, "currency"], () =>
    get(win(), [SHOPIFY, "currency", "active"])
  );
  return currency;
};

const getDocUrl = () => {
  const url = get(win(), [__ST, "pageurl"]);
  if (url) {
    return "https://" + url;
  }
};

const getUid = () => {
  const uid = get(win(), [__ST, "cid"]);
  return uid;
};

const getPage = () => {
  if (thankYou === getStepName()) {
    return thankYou;
  }
  const oWin = win();
  const page = get(oWin, [__ST, "t"], () => get(oWin, [__ST, "p"]));
  return page;
};

const getGaId = () => {
  const url = getDocUrl();
  const ga = getUrl("_ga", url) || "";
  return get(ga.split("-"), [1]);
};

const getClientId = () => {
  const token = get(win(), [...checkoutPath, "token"]);
  if (token) {
    return "shopify-checkout-" + token;
  }
};

const shopify = {
  getStepNo,
  getStepName,
  getShopId,
  getPage,
  getUid,
  getGaId,
  getDocUrl,
  getCurrency,
  getClientId
};

export default shopify;
