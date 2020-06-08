import startTime from "./startTime"; // start time need put in first line
import { i13nDispatch, getParams } from "i13n";
import i13nStore from "i13n-store";
import ini from "parse-ini-string";
import { nest } from "object-nested";
import get, { toMap } from "get-object-value";
import set from "set-object-value";
import query from "css-query-selector";
import { win, doc } from "win-doc";
import { STRING, FUNCTION, UNDEFINED } from "reshow-constant";
import callfunc from "call-func";
import Router from "url-route";

// local import
import storeCbParams, { _LAST_EVENT, _I13N_CB_PARAMS } from "./storeCbParams";
import execScript from "./execScript";
import { lStore } from "./storage";
import parseJson from "./parseJson";
import logError, { setDebugFlag } from "./logError";
import utils from "./utils";
import delegate from "./delegate";
import register, { cleanAllRegister } from "./register";
import req from "./req";
import mergeConfig from "./mergeConfig";
import lazyAttr from "./lazyAttr";
import lazyProducts, { forEachStoreProducts } from "./lazyProducts";
import oneTimeAction from "./oneTimeAction";

// tags
import debugTag from "./debug.tag";
import googleTag from "./google.tag";
// import usergramTag from './usergram.tag';

// constant
const keys = Object.keys;
const PARAMS = "params";

// variable
let _timer;

/**
 * functions
 */
const close = () => _timer && clearInterval(_timer);

const addSectionEvent = (configs, nextDelegates) => section => {
  const secs = get(configs, ["sec", section]);
  if (!secs) {
    console.warn("Section: [" + section + "] not found.");
    return;
  }
  get(secs, ["selects"], []).forEach((select, skey) => {
    const type = get(secs, ["types", skey]);
    const func = e => {
      storeCbParams(parseJson(get(secs, [PARAMS, skey])), e);
      const scriptName = get(secs, ["scripts", skey]);
      if (!scriptName) {
        console.warn("Script name not found", secs, skey);
      } else {
        execScript(scriptName);
      }
    };
    const sels = query.all(select);
    if ((!sels.length && "click" === type) || "delegate" === type) {
      nextDelegates.push({ select, func });
    } else {
      sels.forEach(el => register(el).addEventListener(type, func));
    }
  });
};

const pushPageScript = (configs, nextConfigs) => name => {
  const arrScriptName = get(configs, ["page", name, "scripts"]);
  if (!arrScriptName) {
    return;
  }
  arrScriptName.forEach((scriptName, key) => {
    if (scriptName) {
      const script = [scriptName];
      const scriptParam = get(configs, ["page", name, PARAMS, key]);
      if (scriptParam) {
        script.push(parseJson(scriptParam));
      }
      nextConfigs.nextScripts.push(script);
    }
  });
};

const handleError = e => {
  const error = get(e, ["error"], { message: get(e, ["message"]) });
  const type = e.error ? "WindowScriptErr" : "ExternalScriptErr";
  logError(error, type);
};

const processClose = run => {
  if (doc().readyState === "complete") {
    run();
  } else {
    _timer = setInterval(() => {
      const readyState = doc().readyState;
      if ("complete" === readyState || null == readyState) {
        close();
        run();
      }
    }, 10);
  }
};

const processText = (state, initDone) => (maybeText, arrMerge) => {
  const userConfig =
    STRING === typeof maybeText ? nest(ini(maybeText), "_") : maybeText;
  mergeConfig(userConfig, arrMerge);
  initTags(userConfig);
  const nextConfigs = initRouter(userConfig);
  setTimeout(() => {
    state = state.merge(userConfig);
    i13nStore.addListener(initPageScript, "init");
    // The last Line
    initDone(state.set("nextConfigs", nextConfigs), { processClose });
  }, get(nextConfigs, ["timeout"], 0));
};

/**
 * init functions
 */
const initPageScript = () => {
  register(win()).addEventListener("error", handleError);
  const state = i13nStore.getState();
  const { nextScripts, nextSections } = get(state.get("nextConfigs"));
  nextScripts.forEach(script => {
    if (script[1]) {
      storeCbParams(script[1]);
    }
    execScript(script[0]);
  });
  const nextDelegates = [];
  const doAddSectionEvent = addSectionEvent(
    {
      sec: get(state.get("sec")),
      script: get(state.get("script"))
    },
    nextDelegates
  );
  keys(nextSections).forEach(sec => doAddSectionEvent(sec));
  delegate(doc(), "click", nextDelegates);
  callfunc(get(state.get("nextCallback")));
};

const initRouter = configs => {
  const router = new Router();
  const nextConfigs = {
    nextScripts: [],
    nextSections: {},
    timeout: 0
  };
  const exePushPageScript = pushPageScript(configs, nextConfigs);
  get(configs, ["router", "rules"], []).forEach((rule, key) => {
    router.addRoute(rule, () => {
      const pageName = get(configs, ["router", "pages", key]);
      const pageConfigs = get(configs, ["page", pageName]);
      exePushPageScript(pageName);
      get(pageConfigs, ["secs"], []).forEach(
        sec => (nextConfigs.nextSections[sec] = 1)
      );
      return get(pageConfigs, ["timeout"], 0);
    });
  });
  const urlPathName = get(configs, ["location"], () => doc().location.pathname);
  let match = router.match(urlPathName);
  if (match) {
    const timeouts = [];
    timeouts.push(match.fn());
    while ((match = match.next())) {
      timeouts.push(match.fn());
    }
    nextConfigs.timeout = Math.max(...timeouts);
  }
  return nextConfigs;
};

const initTags = configs => {
  const tagMap = {
    debug: debugTag,
    gtag: googleTag
    //    usergram: usergramTag,
  };
  const tags = get(configs, ["tag"], {});
  keys(tags).forEach(key => {
    const TAG = tagMap[key];
    if (tags[key].enabled && TAG) {
      if ("debug" === key) {
        setDebugFlag(true);
      }
      TAG.register(i13nStore, key);
    }
  });
};

const maybeDelayAction = (state, action) => () => {
  const cbParams = toMap(state.get(_I13N_CB_PARAMS));
  const isInit = state.get("init");
  const { 0: i13nLastEvent, 1: currentTarget } = toMap(state.get(_LAST_EVENT));
  const params = getParams(action);
  if (!isNaN(params.delay)) {
    delete action.params.delay;
  }
  const { i13nCb, lazeInfo, i13nPageCb, wait, lazyKey } = params;
  let I13N = params.I13N;
  if (lazeInfo) {
    I13N.lazeInfo = lazeInfo;
  }
  if (FUNCTION === typeof i13nCb) {
    if (currentTarget && !cbParams.currentTarget) {
      cbParams.currentTarget = currentTarget;
    }
    I13N = i13nCb(i13nLastEvent, get(I13N, null, {}), cbParams, state);
    delete action.params.i13nCb;
  }

  // reset I13N
  I13N = oneTimeAction(I13N, state);
  state = state.set("I13N", I13N);
  if (!I13N) {
    set(action, [PARAMS, "stop"], true);
  } else {
    if (UNDEFINED !== typeof wait || !isInit) {
      set(action, [PARAMS, "I13N"], forEachStoreProducts(I13N));
      i13nStore.pushLazyAction(action, lazyKey);
    }
    state = state.delete(_LAST_EVENT).delete(_I13N_CB_PARAMS);
  }

  if (FUNCTION === typeof i13nPageCb) {
    const i13nPage = i13nPageCb(action, I13N, cbParams);
    if (i13nPage) {
      const stateI13nPage = state.get("i13nPage");
      state = state.set(
        "i13nPage",
        stateI13nPage ? stateI13nPage.merge(i13nPage) : i13nPage
      );
    }
  }
  return lazyProducts(state);
};

/**
 * Handler
 */
const initHandler = (state, action, initDone) => {
  const params = getParams(action);
  state = state.merge(params);
  const { iniUrl, iniCb, forceRefresh } = params;
  const process = processText(state, initDone);
  const cb = maybeText =>
    FUNCTION === typeof iniCb ? iniCb(maybeText, process) : process(maybeText);
  if (STRING === typeof iniUrl) {
    const localIni = lStore.get(iniUrl);
    const sessionIni = lazyAttr(iniUrl);
    if (!forceRefresh && sessionIni() && localIni) {
      cb(localIni);
    } else {
      req(iniUrl, oReq => e => {
        cb(oReq.responseText);
        lStore.set(iniUrl, oReq.responseText);
        sessionIni(true);
      });
    }
  } else {
    cb(iniUrl); // assign config object
  }
  return state;
};

const actionHandler = (state, action) => {
  const { delay, wait } = getParams(action);
  const run = maybeDelayAction(state.merge(), action);
  if (!isNaN(delay)) {
    setTimeout(() => {
      const state = run();
      if (state) {
        i13nDispatch(state);
      }
      const I13N = state.get("I13N");
      if (UNDEFINED === typeof wait && keys(I13N.toJS()).length) {
        i13nDispatch("action", { I13N });
      }
    }, delay);
    set(action, [PARAMS, "stop"], true);
  } else {
    state = run();
  }
  return state;
};

const impressionHandler = (state, action) => lazyProducts(state);

const getIni = (iniUrl, iniCb, forceRefresh) => {
  win().i13n = utils();
  let isLoad = false;
  const run = e => {
    if (!isLoad) {
      isLoad = true;
      cleanAllRegister();
      i13nDispatch("reset", {
        initHandler,
        actionHandler,
        impressionHandler
      });
      i13nDispatch("view", {
        forceRefresh,
        iniUrl,
        iniCb,
        initTrigerBy: e.type
      });
    }
  };
  run({ type: "directly" });
  return close;
};

export default getIni;
