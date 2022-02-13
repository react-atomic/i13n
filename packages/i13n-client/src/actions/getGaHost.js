import { getDebugFlag } from "../libs/logError";

const getGaHost = () => {
  const host = `https://www.google-analytics.com/${
    getDebugFlag() ? "debug/" : ""
  }collect`;
  return host;
};

export default getGaHost;
