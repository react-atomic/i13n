// @ts-check

import { removeEmpty } from "array.merge";
import callfunc from "call-func";

// actions
import regTag from "../actions/regTag";
import handleEcommerce from "../actions/handleEcommerce";
import getUserId from "../actions/getUserId";
import DataLayerToMp from "../actions/DataLayerToMp";

// libs
import { mergeGaLabel } from "../libs/gaUtils";

export const mpTag = ({
  store,
  bCookieIndex,
  lazeInfoIndex,
  mpHost,
  utils
}) => {
  const oDataLayerToMp = new DataLayerToMp();
  const doPush = (/**@type any*/ beaconOption) => {
    const state = store.getState();
    const thisMpHost = callfunc(mpHost) || state.get("mpHost");
    const defaultMpHost = state.get("defaultMpHost");
    const host = thisMpHost || defaultMpHost;
    if (host) {
      const d = oDataLayerToMp.getMp(
        {
          trackingId: state.get("trackingId"),
          needTrackingId: state.get("needTrackingId"),
          version: state.get("version"),
        },
        beaconOption
      );
      if (d) {
        utils.send(host, d);
      }
    } else {
      console.warn("mp host not found");
    }
  };

  const push = (/**@type any*/ beaconOption) => {
    const uid = getUserId();
    if (uid) {
      beaconOption.bCookie = uid;
      if (bCookieIndex) {
        beaconOption.bCookieIndex = bCookieIndex;
      }
    }
    if (beaconOption.lazeInfo && lazeInfoIndex) {
      beaconOption.lazeInfoIndex = lazeInfoIndex;
    }
    if (beaconOption.trigger === "action") {
      beaconOption.label = mergeGaLabel(
        beaconOption.label,
        beaconOption.ecommerce ? { ecommerce: beaconOption.ecommerce } : null
      );
    }
    doPush(removeEmpty(beaconOption));
  };

  regTag(store)({
    action: () => {
      const I13N = store.getClone("I13N");
      const { lazeInfo, action, category, label, value, p, p2, p3, p4, p5 } =
        I13N;
      const beaconOption = {
        trigger: "action",
        lazeInfo: JSON.stringify(lazeInfo),
        action,
        category: category ?? action,
        label,
        value,
        p,
        p2,
        p3,
        p4,
        p5,
      };
      push(handleEcommerce(beaconOption, I13N, store));
    },
    impression: () => {
      const I13N = store.getClone("i13nPage");
      const { p, p2, p3, p4, p5 } = I13N;
      const beaconOption = {
        trigger: "impression",
        p,
        p2,
        p3,
        p4,
        p5,
      };
      push(handleEcommerce(beaconOption, I13N, store));
    },
  });
};
