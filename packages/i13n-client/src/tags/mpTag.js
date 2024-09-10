// @ts-check

import { removeEmpty } from "array.merge";
import { getMitt } from "reshow-flux-base";
import callfunc from "call-func";

// actions
import regTag from "../actions/regTag";
import DataLayerToMp from "../actions/DataLayerToMp";

export const mpTag = ({ store, mpHost, extraMpHandler, utils }) => {
  const oDataLayerToMp = new DataLayerToMp();
  const push = (/**@type any*/ beaconOption) => {
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
          userId: state.get("userId"),
          userIp: state.get("userIp"),
          userCountry: state.get("userCountry"),
        },
        beaconOption
      );
      if (d) {
        let finalData = d;
        if (extraMpHandler && extraMpHandler.length) {
          const oEmitt = getMitt();
          extraMpHandler.forEach(
            (
              /**@type import("reshow-flux-base").FluxHandler<any, any>*/ mpHandler
            ) => oEmitt.add(mpHandler)
          );
          finalData = oEmitt.emit(d)();
        }
        utils.send(host, removeEmpty(finalData));
      }
    } else {
      console.warn("mp host not found");
    }
  };

  regTag(store)({
    action: () => {
      const I13N = store.getClone("I13N");
      const { deferredAction, action, category, label, value, p, p2, p3, p4, p5 } =
        I13N;
      const beaconOption = {
        trigger: "action",
        deferredAction,
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
      push(beaconOption);
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
      push(beaconOption);
    },
  });
};
