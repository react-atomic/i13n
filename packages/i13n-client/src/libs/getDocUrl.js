import get from "get-object-value";
import { parseUrl } from "seturl";
import shopify from "../actions/shopify";
import { url } from "seturl";

const getDocUrl = (payload) =>
  get(payload, ["location"], () => shopify.getDocUrl() || url());

const getHostName = (payload) => {
  const { host } = parseUrl(getDocUrl(payload));
  return host;
};

export default getDocUrl;
export { getHostName };
