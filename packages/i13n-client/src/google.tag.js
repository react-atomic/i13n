import get from "get-object-value";
import { UNDEFINED, OBJECT } from "reshow-constant";
import callfunc from "call-func";
import { removeEmpty } from "array.merge";

import shopify from "./shopify";
import BaseTag from "./BaseTag";
import { getViewEcommerce, getActionEcommerce } from "./google.ecommerce";
import toGa4 from "./google.toGa4";
import OfficialGTag from "./official.gtag";
import MpGTag from "./mp.gtag";
import getUserId from "./getUserId";

const keys = Object.keys;
const downstreamMap = {
  mp: MpGTag,
  official: OfficialGTag,
};

class GoogleTag extends BaseTag {
  isInit = false;

  downstreams = [];

  init() {
    const tagData = this.getTagData();
    const { id, downstreams } = tagData;
    get(downstreams, null, []).forEach((downstreamKey) => {
      const obj = downstreamMap[downstreamKey];
      if (!obj) {
        console.warn("Downstream is not found. [" + downstreamKey + "]");
        return;
      }
      const oDownstream = new obj(tagData);
      oDownstream.name = downstreamKey;
      this.downstreams.push(oDownstream);
      oDownstream.init();
    });
  }

  handleEcommerce(config, I13N) {
    const state = this.getState();
    const { ecommerce, value } = callfunc(
      config.trigger === "action" ? getActionEcommerce : getViewEcommerce,
      [I13N, { defaultCurrencyCode: state.get("currencyCode") }]
    );
    if (keys(ecommerce).length) {
      config.ecommerce = ecommerce;
      if (config.trigger === "action") {
        config.category = "Ecommerce";
        if (UNDEFINED === typeof config.value && !isNaN(value)) {
          config.value = value;
        }
      }
    }
    return config;
  }

  push(config) {
    const { gaId, bCookieIndex, lazeInfoIndex } = this.getTagData();
    const state = this.getState();
    const uid = getUserId();
    if (uid) {
      config.bCookie = uid;
      if (bCookieIndex) {
        config.bCookieIndex = bCookieIndex;
      }
    }
    if (config.lazeInfo && lazeInfoIndex) {
      config.lazeInfoIndex = lazeInfoIndex;
    }

    const trigger = {
      action: {
        ua: "lucencyEventAction",
        4: "lucency4Action",
      },
      view: {
        ua: "lucencyEventView",
        4: "lucency4View",
      },
    };
    const triggerVer = 0 === gaId?.indexOf("UA-") ? "ua" : 4;
    config.event = get(trigger, [config.trigger, triggerVer]);
    if (config.trigger === "action") {
      config.label = this.mergeLabel(
        config.label,
        config.ecommerce ? { ecommerce: config.ecommerce } : null
      );
    }
    config.p = config.p ?? shopify.getPage();
    config.expId = state.get("expId");
    config.expVar = state.get("expVar");
    config.siteId = state.get("siteId");
    config.gaId = gaId;
    this.downstreams.forEach((downstream) => {
      if (downstream.name === "official" && triggerVer === 4) {
        const { actionConfig, viewConfig } = toGa4(config);
        if ("view" === config.trigger) {
          downstream.push(removeEmpty(viewConfig));
        }
        if (actionConfig.ecommerce) {
          actionConfig.event = get(trigger, ["action", 4]);
          downstream.push(removeEmpty(actionConfig));
        }
      } else {
        downstream.push(removeEmpty(config));
      }
    });
  }

  mergeLabel(label, more) {
    let thisLabel = label;
    if (keys(more || {}).length) {
      if (OBJECT !== typeof thisLabel) {
        thisLabel = {
          label,
          ...more,
        };
      } else {
        thisLabel = { ...thisLabel, ...more };
      }
    }
    if (OBJECT === typeof thisLabel) {
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
      p5,
    } = I13N;

    const config = {
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

    this.push(this.handleEcommerce(config, I13N));
  }

  impression() {
    const state = this.getState();
    const I13N = this.getClone("i13nPage") || {};
    const { p, p2, p3, p4, p5 } = I13N;

    const config = {
      trigger: "view",
      p,
      p2,
      p3,
      p4,
      p5,
    };

    this.push(this.handleEcommerce(config, I13N));
  }
}

export default GoogleTag;
