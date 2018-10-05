import {i13nDispatch} from 'i13n';
import i13nStore from 'i13n-store';
import ini from 'parse-ini-string';
import {nest} from 'object-nested';
import exec from 'exec-script';
import get from 'get-object-value';
import set from 'set-object-value';
import query from 'css-query-selector';
import {getUrl} from 'seturl';

import Router from './routes';
import req from './req';
import debugTag from './debug.tag';
import googleTag from './google.tag';
import usergramTag from './usergram.tag';
import {toJS} from './BaseTag';

const win = () => window;
const doc = () => document;
const keys = Object.keys;
const pageScripts = [];

const numReg = /\d+/g;
const getNum = s => s.replace(',', '').match(numReg)[0];

const addSectionEvents = configs => section => {
  const events = get(configs, ['sec', section]);
  if (!events) {
    console.error('Section: [' + section + '] not found.');
    return;
  }
  get(events, ['selects'], []).forEach((select, skey) => {
    query.all(select).forEach(el => {
      el.addEventListener(get(events, ['types', skey]), e => {
        i13nDispatch('config/set', {
          lastEvent: e,
          i13nCbParams: JSON.parse(get(events, ['params', skey])),
        });
        const scriptName = get(events, ['scripts', skey]);
        if (!scriptName) {
          console.error('Script name not found', events, skey);
          return;
        }
        const scriptCode = get(configs, ['script', scriptName]);
        if (scriptCode) {
          exec(scriptCode);
        } else {
          console.error('Script: [' + scriptName + '] not found.');
        }
      });
    });
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

const initPageScript = () =>
  pageScripts.forEach(script => {
    if (script[1]) {
      i13nDispatch('config/set', {
        i13nCbParams: script[1],
      });
    }
    exec(script[0]);
  });

const initRouter = configs => {
  const router = new Router();
  const addEvent = addSectionEvents(configs);
  const exePushPageScript = pushPageScript(configs);
  get(configs, ['router', 'rules'], []).forEach((rule, key) => {
    router.addRoute(rule, () => {
      const pageName = get(configs, ['router', 'pages', key]);
      exePushPageScript(pageName);
      get(configs, ['page', pageName, 'secs'], []).forEach(sec => {
        addEvent(sec);
      });
    });
  });
  const loc = doc().location;
  const url = loc.pathname + loc.search;
  let match = router.match(url);
  if (match) {
    match.fn();
    while ((match = match.next())) {
      match.fn();
    }
  }
};

const initTags = configs => {
  win().i13n = {
    dispatch: i13nDispatch,
    query,
    getUrl,
    getNum,
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

const initHandler = (state, action) => {
  const {iniPath, initTrigerBy, iniCb} = get(action, ['params'], {});
  return view => {
    req(iniPath, req => e => {
      const processText = text => {
        const accountConfig = nest(ini(text), '_');
        initTags(accountConfig);
        initRouter(accountConfig);
        state = state.merge(accountConfig);
        i13nStore.addListener(initPageScript, 'init');
        return view(state);
      };
      const text = req.responseText;
      return 'function' === typeof iniCb
        ? iniCb(text, processText)
        : processText(text);
    });
    return state.set('initTrigerBy', initTrigerBy);
  };
};

const actionHandler = (state, action) => {
  const params = get(action, ['params'], {});
  let I13N = params.I13N;
  const {i13nCb, lazeInfo, i13nPageCb, stop, lazyKey} = params;
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
  if (I13N.purchaseId) {
    const purchaseId = state.get('purchaseId');
    if (purchaseId && purchaseId.length) {
      I13N.purchaseId = purchaseId;
      state = state.delete('purchaseId');
    }
  }

  // reset I13N
  state = state.set('I13N', I13N);
  if (!I13N) {
    set(action, ['params', 'stop'], true);
  } else {
    if (stop) {
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

i13nDispatch('config/set', {
  initHandler,
  actionHandler,
  impressionHandler,
});

const getIni = (iniPath, iniCb) => {
  let isLoad = false;
  const run = e => {
    if (!isLoad) {
      isLoad = true;
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
