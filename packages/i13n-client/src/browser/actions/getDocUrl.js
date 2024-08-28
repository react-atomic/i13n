import get from "get-object-value";
import { STRING } from "reshow-constant";
import { doc } from "win-doc";

const getDocUrl = (maybeDoc, bToString) => {
  const loc = get(maybeDoc, ["location"], () => doc().location);
  if (bToString) {
    if (STRING === typeof loc) {
      return loc;
    } else {
      return loc.toString();
    }
  } else {
    if (STRING === typeof loc) {
      return new URL(loc);
    } else {
      return loc;
    }
  }
};

export const getHostName = (payload) => {
  const { hostname } = getDocUrl(payload);
  return hostname;
};

export default getDocUrl;
