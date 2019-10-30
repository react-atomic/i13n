import {i13nDispatch} from 'i13n';
import i13nStore from 'i13n-store';
import ini from 'parse-ini-string';
import {nest} from 'object-nested';
import exec from 'exec-script';
import {localStorage, Storage} from 'get-storage';
import get, {toJS} from 'get-object-value';
import set from 'set-object-value';
import query from 'css-query-selector';
import {win, doc} from 'win-doc';
import {STRING, FUNCTION, UNDEFINED} from 'reshow-constant';
import callfunc from 'call-func';

// local import
import logError, {setDebugFlag} from './logError';
import utils from './utils';
import delegate from './delegate';
import Router from './Router';
import req from './req';
import mergeConfig from './mergeConfig';
import lazyAttr from './lazyAttr';
import lazyProducts, {forEachStoreProducts} from './lazyProducts';

// tags
import debugTag from './debug.tag';
import googleTag from './google.tag';
// import usergramTag from './usergram.tag';

// constant
const keys = Object.keys;
const lStore = new Storage(localStorage);
const PARAMS = 'params';

/**
 * functions
 */
const getParams = action => get(action, [PARAMS], {});

const addSectionEvent = (configs, nextDelegates) => section => {
  const secs = get(configs, ['sec', section]);
  if (!secs) {
    console.warn('Section: [' + section + '] not found.');
    return;
  }
  get(secs, ['selects'], []).forEach((select, skey) => {
    const type = get(secs, ['types', skey]);
    const func = e => {
      i13nDispatch({
        lastEvent: e,
        i13nCbParams: JSON.parse(get(secs, [PARAMS, skey])),
      });
      const scriptName = get(secs, ['scripts', skey]);
      if (!scriptName) {
        console.warn('Script name not found', secs, skey);
        return;
      }
      const scriptCode = get(configs, ['script', scriptName]);
      if (scriptCode) {
        exec(scriptCode, null, null, e => logError(e, 'I13nScriptErr'));
      } else {
        console.warn('Script: [' + scriptName + '] not found.');
      }
    };
    const sels = query.all(select);
    if ((!sels.length && 'click' === type) || 'delegate' === type) {
      nextDelegates.push({select, func});
    } else {
      sels.forEach(el => el.addEventListener(type, func));
    }
  });
};

const pushPageScript = (configs, nextConfigs) => name => {
  const arrScriptName = get(configs, ['page', name, 'scripts']);
  if (!arrScriptName) {
    return;
  }
  arrScriptName.forEach((scriptName, key) => {
    const pageScript = get(configs, ['script', scriptName]);
    if (pageScript) {
      const script = [pageScript];
      const scriptParam = get(configs, ['page', name, PARAMS, key]);
      if (scriptParam) {
        script.push(JSON.parse(scriptParam));
      }
      nextConfigs.nextScripts.push(script);
    }
  });
};

const handleError = e => {
  const error = get(e, ['error'], {message: get(e, ['message'])});
  const type = e.error ? 'WindowScriptErr' : 'ExternalScriptErr';
  logError(error, type);
};

const processText = (state, done) => (maybeText, arrMerge) => {
  const userConfig =
    STRING === typeof maybeText ? nest(ini(maybeText), '_') : maybeText;
  mergeConfig(userConfig, arrMerge);
  initTags(userConfig);
  const nextConfigs = initRouter(userConfig);
  setTimeout(() => {
    state = state.merge(userConfig);
    i13nStore.addListener(initPageScript, 'init');
    // The last Line
    done(state.set('nextConfigs', nextConfigs));
  }, get(nextConfigs, ['timeout'], 0));
};

/**
 * init functions
 */
const initPageScript = () => {
  win().addEventListener('error', handleError);
  win().i13n = utils();
  const state = i13nStore.getState();
  const {nextScripts, nextSections} = toJS(state.get('nextConfigs'));
  nextScripts.forEach(script => {
    if (script[1]) {
      i13nDispatch({
        i13nCbParams: script[1],
      });
    }
    exec(script[0], null, null, e => logError(e, 'InitI13nScriptErr'));
  });
  const nextDelegates = [];
  const doAddSectionEvent = addSectionEvent(
    {
      sec: toJS(state.get('sec')),
      script: toJS(state.get('script')),
    },
    nextDelegates,
  );
  keys(nextSections).forEach(sec => doAddSectionEvent(sec));
  delegate(doc(), 'click', nextDelegates);
  callfunc(toJS(state.get('nextCallback')));
};

const initRouter = configs => {
  const router = new Router();
  const nextConfigs = {
    nextScripts: [],
    nextSections: {},
    timeout: 0,
  };
  const exePushPageScript = pushPageScript(configs, nextConfigs);
  get(configs, ['router', 'rules'], []).forEach((rule, key) => {
    router.addRoute(rule, () => {
      const pageName = get(configs, ['router', 'pages', key]);
      const pageConfigs = get(configs, ['page', pageName]);
      exePushPageScript(pageName);
      get(pageConfigs, ['secs'], []).forEach(
        sec => (nextConfigs.nextSections[sec] = 1),
      );
      return get(pageConfigs, ['timeout'], 0);
    });
  });
  const urlPathName = get(configs, ['location'], () => doc().location.pathname);
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
    gtag: googleTag,
//    usergram: usergramTag,
  };
  const tags = get(configs, ['tag'], {});
  keys(tags).forEach(key => {
    const TAG = tagMap[key];
    if (tags[key].enabled && TAG) {
      if ('debug' === key) {
        setDebugFlag(true);
      }
      TAG.register(i13nStore, key);
    }
  });
};

/**
 * Handler
 */
const initHandler = (state, action, initDone) => {
  const params = getParams(action);
  state = state.merge(params);
  const {iniUrl, iniCb, forceRefresh} = params;
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
  const params = getParams(action);
  let I13N = params.I13N;
  const {i13nCb, lazeInfo, i13nPageCb, wait, lazyKey} = params;
  const i13nCbParams = toJS(state.get('i13nCbParams'));
  if (FUNCTION === typeof i13nCb) {
    I13N = i13nCb(
      toJS(state.get('lastEvent')),
      get(I13N, null, {}),
      i13nCbParams,
      state,
    );
    delete action.params.i13nCb;
  }
  if (lazeInfo) {
    I13N.lazeInfo = lazeInfo;
  }

  // reset I13N
  state = state.set('I13N', I13N);
  if (!I13N) {
    set(action, [PARAMS, 'stop'], true);
  } else {
    if (UNDEFINED !== typeof wait) {
      set(action, [PARAMS, 'I13N'], forEachStoreProducts(I13N));
      i13nStore.pushLazyAction(action, lazyKey);
    }
  }

  if (FUNCTION === typeof i13nPageCb) {
    const i13nPage = i13nPageCb(action, I13N, i13nCbParams);
    if (i13nPage) {
      const stateI13nPage = state.get('i13nPage');
      state = state.set(
        'i13nPage',
        stateI13nPage ? stateI13nPage.merge(i13nPage) : i13nPage,
      );
    }
  }
  return lazyProducts(state.delete('lastEvent').delete('i13nCbParams'));
};

const impressionHandler = (state, action) => lazyProducts(state);

const getIni = (iniUrl, iniCb, forceRefresh) => {
  let isLoad = false;
  const run = e => {
    if (!isLoad) {
      isLoad = true;
      i13nDispatch('reset', {
        initHandler,
        actionHandler,
        impressionHandler,
      });
      i13nDispatch('view', {
        forceRefresh,
        iniUrl,
        iniCb,
        initTrigerBy: e.type,
      });
    }
  };
  run({type: 'directly'});
};

export default getIni;
