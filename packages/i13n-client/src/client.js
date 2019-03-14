import {i13nDispatch} from 'i13n';
import i13nStore from 'i13n-store';
import ini from 'parse-ini-string';
import {nest} from 'object-nested';
import exec, {getLastScript} from 'exec-script';
import get, {toJS} from 'get-object-value';
import set from 'set-object-value';
import query, {queryFrom} from 'css-query-selector';
import {getUrl} from 'seturl';
import getCookie from 'get-cookie';
import getRandomId from 'get-random-id';
import {removeEmpty} from 'array.merge';
import {win, doc} from 'win-doc';
import {getNum} from 'to-percent-js';
import {STRING, FUNCTION, UNDEFINED} from 'reshow-constant';

// local import
import delegate from './delegate';
import getOptionText from './getOptionText';
import getRadioValue from './getRadioValue';
import Router from './Router';
import req from './req';
import text from './text';
import getElValue from './getElValue';
import debugTag from './debug.tag';
import googleTag from './google.tag';
import usergramTag from './usergram.tag';
import lazyAttr from './lazyAttr';
import lazyProducts, {forEachStoreProducts} from './lazyProducts';

const keys = Object.keys;
const isArray = Array.isArray;
const PARAMS = 'params';
let debugFlag = false;

/**
 * tool
 */
const getParams = action => get(action, [PARAMS], {});

/**
 * functions
 */
const mergeConfig = (conf, merges) => {
  if (!merges) {
    return conf;
  }
  merges.forEach(({path, value, append}) => set(conf, path, value, append));
  return conf;
};

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

const logError = (error, action) => {
  let {message, stack} = error;
  stack = get(error, ['stack'], '').split(/\n/);
  i13nDispatch('action', {
    wait: 0,
    I13N: {
      action,
      category: 'Error',
      label: {
        message,
        stack,
        url: doc().URL,
        lastExec: getLastScript(),
      },
    },
  });
  if (debugFlag) {
    throw error;
  }
};

const handleError = e => {
  const error = get(e, ['error'], {message: get(e, ['message'])});
  const type = e.error ? 'WindowScriptErr' : 'ExternalScriptErr';
  logError(error, type);
};

/**
 * init functions
 */
const initPageScript = () => {
  win().addEventListener('error', handleError);
  win().i13n = {
    merge: (...args) => {
      let results = {};
      args.forEach(a => (results = {...results, ...a}));
      return results;
    },
    error: message => logError({message}, 'CustomError'),
    arrayFrom: arr => [...arr],
    objectToArray: obj => keys(obj).map(key => obj[key]),
    getNum: s => getNum(text(s)),
    joinCategory: arr =>
      arr.map(item => text(item).replace('/', '-')).join('/'),
    dispatch: i13nDispatch,
    keys,
    isArray,
    removeEmpty,
    query,
    queryFrom,
    getUrl,
    get,
    getOptionText,
    getElValue,
    getRadioValue,
    getCookie,
    getRandomId,
    delegate,
    lazyAttr,
    text,
    toJS,
  };
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
  const loc = doc().location;
  const url = loc.pathname;
  let match = router.match(url);
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
    usergram: usergramTag,
  };
  const tags = get(configs, ['tag'], {});
  keys(tags).forEach(key => {
    const TAG = tagMap[key];
    if (tags[key].enabled && TAG) {
      if ('debug' === key) {
        debugFlag = true;
      }
      TAG.register(i13nStore, key);
    }
  });
};

const processText = (state, done) => (maybeText, arrMerge) => {
  const oConfig =
    STRING === typeof maybeText ? nest(ini(maybeText), '_') : maybeText;
  const userConfig = mergeConfig(oConfig, arrMerge);
  initTags(userConfig);
  const nextConfigs = initRouter(userConfig);
  setTimeout(() => {
    state = state.merge(userConfig);
    i13nStore.addListener(initPageScript, 'init');
    // The last Line
    done(state.set('nextConfigs', nextConfigs));
  }, get(nextConfigs, ['timeout'], 0));
};

const initHandler = (state, action, initDone) => {
  const params = getParams(action);
  state = state.merge(params);
  const {iniUrl, iniCb} = params;
  const process = processText(state, initDone);
  const cb = maybeText =>
    FUNCTION === typeof iniCb ? iniCb(maybeText, process) : process(maybeText);
  if (STRING === typeof initUrl) {
    req(iniUrl, oReq => e => cb(oReq.responseText));
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

const getIni = (iniUrl, iniCb) => {
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
        iniUrl,
        iniCb,
        initTrigerBy: e.type,
      });
    }
  };
  win().addEventListener('load', run);
  setTimeout(() => run({type: 'timeout'}), 500);
};

export default getIni;
export {mergeConfig};
