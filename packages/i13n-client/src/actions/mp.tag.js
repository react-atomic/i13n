import { removeEmpty } from "array.merge";
import get from "get-object-value";
import callfunc from "call-func";

// actions
import regTag from "../actions/regTag";
import handleEcommerce from "../actions/handleEcommerce";
import getUserId from "../actions/getUserId";
import shopify from "../actions/shopify";
import DataLayerToMp from "../actions/DataLayerToMp";

// libs
import { mergeGaLabel } from "../libs/gaUtils";
import { beacon } from "../libs/req";

const mpTag = ({ store, gaId, bCookieIndex, lazeInfoIndex, mpHost }) => {
  const oDataLayerToMp = new DataLayerToMp();
  const doPush = (beaconOption, send) => {
    send = send || beacon;
    const state = store.getState();
    const thisMpHost = callfunc(mpHost) || state.get("mpHost");
    const defaultMpHost = state.get("defaultMpHost");
    const host = thisMpHost || defaultMpHost;
    if (host) {
      const d = oDataLayerToMp.getMp(
        {
          trackingId: beaconOption.gaId,
          needTrackingId: state.get("needTrackingId"),
          version: state.get("version"),
        },
        beaconOption
      );
      if (d) {
        send(host, d);
      }
    } else {
      console.warn("mp host not found");
    }
  };

  const push = (beaconOption) => {
    const state = store.getState();
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
    beaconOption.p = beaconOption.p ?? shopify.getPage();
    beaconOption.expId = state.get("expId");
    beaconOption.expVar = state.get("expVar");
    beaconOption.siteId = state.get("siteId");
    beaconOption.email = state.get("email");
    beaconOption.gaId = gaId || state.get("trackingId");
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

export default mpTag;
