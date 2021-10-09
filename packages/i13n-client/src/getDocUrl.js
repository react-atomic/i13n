import get from "get-object-value";
import { doc } from "win-doc";
import { parseUrl } from "seturl";
import shopify from "./shopify";

const getDocUrl = (configs) =>
  get(configs, ["location"], () => shopify.getDocUrl() || doc().URL);

const getHostName = (configs) => {
  const {host} = parseUrl(getDocUrl(configs));
  return host;
};

export default getDocUrl;
export { getHostName };
