//@ts-check

import simple from "../clients/simple";
import { mpTag } from "../tags/mpTag";
import { getGaHost } from "../libs/gaUtils";

// node only
import { sendWithFetch } from "../libs/sendWithFetch";

/**
 * @param {string} trackingId
 * @param {Object<string, any>=} options
 */
export default function SimpleNode(trackingId, options = {}) {
  options.tags = [
    {
      item: mpTag,
      data: {
        mpHost: getGaHost,
      }
    },
  ];
  options.utils = {
    send: sendWithFetch,
  };
  return simple(trackingId, options);
}
