import get from "get-object-value";
import { doc } from "win-doc";
import { getPath } from "seturl";
import shopify from "./shopify";

const getDocUrl = (configs) =>
  get(configs, ["location"], () => shopify.getDocUrl() || doc().URL);

const getHostName = () => {
  const hostname = getPath(getDocUrl(), 11);
  return hostname;
};

export default getDocUrl;
export { getHostName };
