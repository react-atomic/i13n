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

// local import
import delegate from './delegate';
import getOptionText from './getOptionText';
import getRadioValue from './getRadioValue';
import Router from './Router';
import req from './req';
import debugTag from './debug.tag';
import googleTag from './google.tag';
import usergramTag from './usergram.tag';
import lazyAttr from './lazyAttr';
import lazyProducts, {forEachGoStore} from './lazyProducts';

const win = () => window;
const doc = () => document;
const keys = Object.keys;
let pageScripts;
let debugFlag = false;

const addSectionEvents = (configs, delegates) => section => {
  const secs = get(configs, ['sec', section]);
  if (!secs) {
    console.warn('Section: [' + section + '] not found.');
    return;
  }
  get(secs, ['selects'], []).forEach((select, skey) => {
    const type = get(secs, ['types', skey]);
    const func = e => {
      i13nDispatch('config/set', {
        lastEvent: e,
        i13nCbParams: JSON.parse(get(secs, ['params', skey])),
      });
      const scriptName = get(secs, ['scripts', skey]);
      if (!scriptName) {
        console.warn('Script name not found', secs, skey);
        return;
      }
      const scriptCode = get(configs, ['script', scriptName]);
      if (scriptCode) {
        exec(scriptCode, null, null, e => logError(e, 'ScriptError'));
      } else {
        console.warn('Script: [' + scriptName + '] not found.');
      }
    };
    const sels = query.all(select);
    if ((!sels.length && 'click' === type) || 'delegate' === type) {
      delegates.push({select, func});
    } else {
      sels.forEach(el => el.addEventListener(type, func));
    }
  });
};

const pushPageScript = configs => name => {
  const arrScriptName = get(configs, ['page', name, 'scripts']);
  if (!arrScriptName) {
    return;
  }
  arrScriptName.forEach((scriptName, key) => {
    const pageScript = get(configs, ['script', scriptName]);
    if (pageScript) {
      const script = [pageScript];
      const scriptParam = get(configs, ['page', name, 'params', key]);
      if (scriptParam) {
        script.push(JSON.parse(scriptParam));
      }
      pageScripts.push(script);
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
  const error = get(e, ['error'], {});
  const type = error ? 'WindowError' : 'ExternalScriptError';
  logError(error, type);
};

const initPageScript = () => {
  win().addEventListener('error', handleError);
  pageScripts.forEach(script => {
    if (script[1]) {
      i13nDispatch('config/set', {
        i13nCbParams: script[1],
      });
    }
    exec(script[0], null, null, e => logError(e, 'InitScriptError'));
  });
};

const initRouter = configs => {
  const router = new Router();
  const delegates = [];
  const addEvent = addSectionEvents(configs, delegates);
  const exePushPageScript = pushPageScript(configs);
  get(configs, ['router', 'rules'], []).forEach((rule, key) => {
    router.addRoute(rule, () => {
      const pageName = get(configs, ['router', 'pages', key]);
      const pageConfigs = get(configs, ['page', pageName]);
      exePushPageScript(pageName);
      get(pageConfigs, ['secs'], []).forEach(sec => {
        addEvent(sec);
      });
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
    delegate(doc(), 'click', delegates);
    return Math.max(...timeouts);
  }
};

const text = el =>
  el ? (el.innerText ? el.innerText : el.trim ? el : '').trim() : '';

const getElValue = el => get(query.el(el), ['value']);

const joinCategory = arr =>
  arr.map(item => text(item).replace('/', '-')).join('/');

const numReg = /\d+/g;
const getNum = s => {
  const match = text(s)
    .replace(',', '')
    .match(numReg);
  if (!match) {
    console.warn('Get number fail', s);
    return 0;
  } else {
    return match[0];
  }
};

const initTags = configs => {
  win().i13n = {
    arrayFrom: arr => [...arr],
    dispatch: i13nDispatch,
    query,
    queryFrom,
    getUrl,
    getNum,
    get,
    getOptionText,
    getElValue,
    getRadioValue,
    getCookie,
    getRandomId,
    delegate,
    lazyAttr,
    text,
    joinCategory,
  };
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

const mergeConfig = (conf, merges) => {
  if (!merges) {
    return conf;
  }
  merges.forEach(({path, value, append}) => set(conf, path, value, append));
  return conf;
};

const initHandler = (state, action, done) => {
  const {iniPath, initTrigerBy, iniCb} = get(action, ['params'], {});
  state = state.set('initTrigerBy', initTrigerBy);
  req(iniPath, oReq => e => {
    const processText = (text, arrMerge) => {
      const userConfig = mergeConfig(nest(ini(text), '_'), arrMerge);
      initTags(userConfig);
      const timeout = initRouter(userConfig);
      setTimeout(() => {
        state = state.merge(userConfig);
        i13nStore.addListener(initPageScript, 'init');
        // The last Line
        done(state);
      }, get(timeout, null, 0));
    };
    const text = oReq.responseText;
    return 'function' === typeof iniCb
      ? iniCb(text, processText)
      : processText(text);
  });
  return state;
};

const actionHandler = (state, action) => {
  const params = get(action, ['params'], {});
  let I13N = params.I13N;
  const {i13nCb, lazeInfo, i13nPageCb, wait, lazyKey} = params;
  const i13nCbParams = toJS(state.get('i13nCbParams'));
  if ('function' === typeof i13nCb) {
    I13N = i13nCb(
      toJS(state.get('lastEvent')),
      get(I13N, null, {}),
      i13nCbParams,
      i13nStore.getState(),
    );
    delete action.params.i13nCb;
  }
  if (lazeInfo) {
    I13N.lazeInfo = lazeInfo;
  }

  // reset I13N
  state = state.set('I13N', I13N);
  if (!I13N) {
    set(action, ['params', 'stop'], true);
  } else {
    if ('undefined' !== typeof wait) {
      set(action, ['params', 'I13N'], forEachGoStore(I13N));
      i13nStore.pushLazyAction(action, lazyKey);
    }
  }

  if ('function' === typeof i13nPageCb) {
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

const getIni = (iniPath, iniCb) => {
  let isLoad = false;
  const run = e => {
    if (!isLoad) {
      isLoad = true;
      pageScripts = [];
      i13nDispatch('reset', {
        initHandler,
        actionHandler,
        impressionHandler,
      });
      i13nDispatch('view', {
        iniPath,
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
