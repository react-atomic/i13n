import { win } from "win-doc";
import get from "get-object-value";
import { getUrl } from "seturl";

const checkoutPath = ["Shopify", "Checkout"];
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

const getCurrency = () => {
  const currency = get(win(), [...checkoutPath, "currency"], () =>
    get(win(), ["Shopify", "currency", "active"])
  );
  return currency;
};

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

const getPage = () => {
  if (thankYou === getStepName()) {
    return thankYou;
  }
  const oWin = win();
  const page = get(oWin, ["__st", "t"], () => get(oWin, ["__st", "p"]));
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
  getPage,
  getUid,
  getGaId,
  getDocUrl,
  getCurrency,
  getClientId
};

export default shopify;
