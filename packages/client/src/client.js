import {i13nDispatch} from 'i13n';
import i13nStore from 'i13n-store';
import ini from 'parse-ini-string';
import {nest} from 'object-nested';
import exec, {getLastScript} from 'exec-script';
import get from 'get-object-value';
import set from 'set-object-value';
import {sessionStorage, Storage} from 'get-storage';
import query from 'css-query-selector';
import {getUrl} from 'seturl';

// local import
import delegate from './delegate';
import getOptionText from './getOptionText';
import Router from './Router';
import req from './req';
import debugTag from './debug.tag';
import googleTag from './google.tag';
import usergramTag from './usergram.tag';
import {toJS} from './BaseTag';

const win = () => window;
const doc = () => document;
const keys = Object.keys;
let pageScripts;

const numReg = /\d+/g;
const getNum = s => {
  const match = s.replace(',', '').match(numReg);
  if (!match) {
    console.error('Get number fail', s);
  } else {
    return match[0];
  }
};

const addSectionEvents = (configs, delegates) => section => {
  const secs = get(configs, ['sec', section]);
  if (!secs) {
    console.error('Section: [' + section + '] not found.');
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
        console.error('Script name not found', secs, skey);
        return;
      }
      const scriptCode = get(configs, ['script', scriptName]);
      if (scriptCode) {
        exec(scriptCode);
      } else {
        console.error('Script: [' + scriptName + '] not found.');
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

const handleError = e => {
  const {message, filename, lineno, colno, error} = e;
  if (!error) {
    return;
  }
  const stack = get(error, ['stack'], '').split(/\n/);
  i13nDispatch('action', {
    I13N: {
      action: 'Error',
      label: {
        message,
        filename,
        lineno,
        colno,
        stack,
        url: doc().URL,
        lastExec: getLastScript(),
      },
    },
  });
};

const initPageScript = () => {
  win().addEventListener('error', handleError);
  pageScripts.forEach(script => {
    if (script[1]) {
      i13nDispatch('config/set', {
        i13nCbParams: script[1],
      });
    }
    exec(script[0]);
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
  const url = loc.pathname + loc.search;
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

const sStore = new Storage(sessionStorage);
const lazyAttr = key => val => {
  const arr = sStore.get('lazyAttr');
  if ('undefined' === typeof key) {
    return arr;
  }
  if ('undefined' !== typeof value) {
    arr[key] = val;
    sStore.set('lazyAttr', arr);
  }
  return arr[key];
};

const text = el => (el ? el.innerText.trim() : null);

const initTags = configs => {
  win().i13n = {
    dispatch: i13nDispatch,
    query,
    getUrl,
    getNum,
    get,
    getOptionText,
    delegate,
    lazyAttr,
    text,
  };
  const tagMap = {
    debug: debugTag,
    gtag: googleTag,
    usergram: usergramTag,
  };
  const tags = get(configs, ['tag'], {});
  keys(tags).forEach(key => {
    const tag = tags[key];
    if (tag.enabled && tagMap[key]) {
      tagMap[key].register(i13nStore, key);
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
      set(action, ['params', 'I13N'], I13N);
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
  return state.delete('lastEvent').delete('i13nCbParams');
};

const impressionHandler = (state, action) => state;

const getIni = (iniPath, iniCb) => {
  let isLoad = false;
  i13nDispatch('config/reset');
  const run = e => {
    if (!isLoad) {
      isLoad = true;
      pageScripts = [];
      i13nDispatch({
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
