import { win } from "win-doc";
import get from "get-object-value";

const getDocUrl = () => {
  const url = get(win(), ["__st", "pageurl"]);
  if (url) {
    return "https://" + url;
  }
};

const shopify = {
  getDocUrl,
  getClientId: () => {
    const url = getDocUrl();
  }
};

export default shopify;
