import {i13nDispatch} from 'i13n';
import i13nStore from 'i13n/store';
import ini from 'parse-ini-string';
import {nest} from 'object-nested';
import exec from 'exec-script';
import get from 'get-object-value';
import query from 'css-query-selector';

import Router from './routes';
import req from './req';
import googleTag from './google.tag';
import usergramTag from './usergram.tag';

const win = () => window;
const doc = () => document;
const keys = Object.keys;
const pageScripts = [];

const actionHandler = (state, action) => {
  let I13N = get(action, ['params', 'I13N']);
  const I13NCallback = get(action, ['params', 'I13NCallback']);
  if ('function' === typeof I13NCallback) {
    const e = state.get('lastEvent') 
    I13N = I13NCallback(e, I13N)
  }
  if (I13N) {
    state = state.set('I13N', I13N);
  }
  return state;
};

const impressionHandler = (state, action) => {
  console.warn('view', state.get('pvid'));
  return state;
};

const addSectionEvents = configs => section => {
  const events = get(configs, ['sec', section, 'event']);
  get(events, ['selects'], []).forEach((select, skey) => {
    query.all(select).forEach(el => {
      el.addEventListener(get(events, ['types', skey]), e => {
        const scriptName = get(events, ['scripts', skey]);
        const scriptCode = get(configs, ['script', scriptName]);
        i13nDispatch('config/set', {
          lastEvent: e
        });
        exec(scriptCode);
      });
    });
  });
};

const initRouter = configs => {
  const router = new Router();
  const addEvent = addSectionEvents(configs);
  get(configs, ['router', 'rules'], []).forEach((rule, key) => {
    router.addRoute(rule, () => {
      const pageName = get(configs, ['router', 'names', key]);
      const pageScriptName = get(configs, ['page', pageName, 'script']);
      const pageScript = get(configs, ['script', pageScriptName]);
      if (pageScript) {
        pageScripts.push(pageScript);
      }
      get(configs, ['page', pageName, 'secs'], []).forEach(sec => {
        addEvent(sec);
      });
    });
  });
  const loc = doc().location;
  const url = loc.pathname + loc.search;
  const match = router.match(url);
  if (match) {
    match.fn();
  }
};

const initTags = configs => {
  win().i13nDispatch = i13nDispatch;
  const tagMap = {
    gtag: googleTag,
    usergram: usergramTag,
  };
  const tags = get(configs, ['tags'], {});
  keys(tags).forEach(key => {
    const tag = tags[key];
    if (tag.enabled) {
      tagMap[key].register(i13nStore, key);
    }
  });
};

const initPageScript = () => {
  setTimeout(() => pageScripts.forEach(script => exec(script)));
};

const initHandler = (state, action) => {
  const params = get(action, ['params'], {});
  const iniPath = params.iniPath;
  return view => {
    req(iniPath, req => e => {
      const text = req.responseText;
      const accountConfig = nest(ini(text), '_');
      initTags(accountConfig);
      initRouter(accountConfig);
      state = state.merge(accountConfig);
      i13nStore.addListener(initPageScript, 'init');
      return view(state);
    });
    return state.set('initTrigerBy', params.initTrigerBy);
  };
};

i13nDispatch('config/set', {
  initHandler,
  actionHandler,
  impressionHandler,
});

const getIni = iniPath => {
  let isLoad = false;
  const run = e => {
    if (!isLoad) {
      isLoad = true;
      i13nDispatch('view', {
        iniPath,
        initTrigerBy: e.type,
      });
    }
  };
  win().addEventListener('load', run);
  setTimeout(() => run({type: 'timeout'}), 500);
};

export default getIni;
