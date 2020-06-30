import get from "get-object-value";
import { UNDEFINED } from "reshow-constant";

import shopify from "./shopify";
import BaseTag from "./BaseTag";
import { getViewEcommerce, getActionEcommerce } from "./google.ecommerce";
import OfficialGTag from "./official.gtag";
import MpGTag from "./mp.gtag";

const keys = Object.keys;
const downstreamMap = {
  mp: MpGTag,
  official: OfficialGTag
};

class GoogleTag extends BaseTag {
  isInit = false;

  downstreams = [];

  init() {
    const tagData = this.getTagData();
    const { id, downstreams } = tagData;
    get(downstreams, null, []).forEach(downstreamKey => {
      const obj = downstreamMap[downstreamKey];
      if (!obj) {
        console.warn("Downstream is not found. [" + downstreamKey + "]");
        return;
      }
      const oDownstream = new obj(tagData);
      this.downstreams.push(oDownstream);
      oDownstream.init();
    });
  }

  push(config) {
    const { gaId, bCookieIndex, lazeInfoIndex } = this.getTagData();
    const state = this.getState();
    const uid = state.get("uid") ?? shopify.getUid();
    if (uid) {
      config.bCookie = uid;
      if (bCookieIndex) {
        config.bCookieIndex = bCookieIndex;
      }
    }
    if (config.lazeInfo && lazeInfoIndex) {
      config.lazeInfoIndex = lazeInfoIndex;
    }
    config.p = config.p ?? shopify.getPage();
    config.expId = state.get("expId");
    config.expVar = state.get("expVar");
    config.gaId = gaId;
    this.downstreams.forEach(downstream => downstream.push(config));
  }

  mergeLabel(label, more) {
    let thisLabel = label;
    if (keys(more).length) {
      if ("object" !== typeof thisLabel) {
        thisLabel = {
          label,
          ...more
        };
      } else {
        thisLabel = { ...thisLabel, ...more };
      }
    }
    if ("object" === typeof thisLabel) {
      thisLabel = JSON.stringify(thisLabel);
    }
    return thisLabel;
  }

  action() {
    const state = this.getState();
    const I13N = this.getClone("I13N") || {};
    const {
      lazeInfo,
      action,
      category,
      label,
      value,
      p,
      p2,
      p3,
      p4,
      p5
    } = I13N;
    const thisCategory = category ? category : action;

    const more = {};

    const config = {
      event: "lucencyEventAction",
      p,
      p2,
      p3,
      p4,
      p5,
      action,
      category: thisCategory,
      value,
      lazeInfo: JSON.stringify(lazeInfo)
    };

    const { ecommerce, value: eValue } = getActionEcommerce(
      I13N,
      state.get("currencyCode")
    );
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
      config.category = "Ecommerce";
      more.ecommerce = ecommerce;
      if (UNDEFINED === typeof value && !isNaN(eValue)) {
        config.value = eValue;
      }
    }
    config.label = this.mergeLabel(label, more);
    this.push(config);
  }

  impression() {
    const state = this.getState();
    const I13N = this.getClone("i13nPage") || {};
    const { p, p2, p3, p4, p5 } = I13N;

    const config = {
      event: "lucencyEventView",
      p,
      p2,
      p3,
      p4,
      p5
    };

    const ecommerce = getViewEcommerce(I13N, state.get("currencyCode"));
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
    }

    this.push(config);
  }
}

export default GoogleTag;
