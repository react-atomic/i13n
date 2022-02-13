import get from "get-object-value";
import { doc } from "win-doc";
import { parseUrl } from "seturl";
import shopify from "../actions/shopify";

const getDocUrl = (payload) =>
  get(payload, ["location"], () => shopify.getDocUrl() || doc().URL);

const getHostName = (payload) => {
  const {host} = parseUrl(getDocUrl(payload));
  return host;
};

export default getDocUrl;
export { getHostName };
