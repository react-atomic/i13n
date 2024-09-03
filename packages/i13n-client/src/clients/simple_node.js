//@ts-check

import simple from "../clients/simple";
import { mpTag } from "../tags/mpTag";
import { sendWithFetch } from "../libs/sendWithFetch";
import { getGaHost } from "../libs/gaUtils";

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
