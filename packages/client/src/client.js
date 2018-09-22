import {i13nDispatch} from 'i13n';
import i13nStore from 'i13n/store';
import ini from 'parse-ini-string';
import {nest} from 'object-nested';
import exec from 'exec-script';
import get from 'get-object-value';
import set from 'set-object-value';
import query from 'css-query-selector';

import Router from './routes';
import req from './req';
import googleTag from './google.tag';
import usergramTag from './usergram.tag';

const win = () => window;
const doc = () => document;
const keys = Object.keys;
const pageScripts = [];

const addSectionEvents = configs => section => {
  const events = get(configs, ['sec', section, 'event']);
  get(events, ['selects'], []).forEach((select, skey) => {
    query.all(select).forEach(el => {
      el.addEventListener(get(events, ['types', skey]), e => {
        i13nDispatch('config/set', {
          lastEvent: e,
          i13nCbParams: get(events, ['params', skey])
        });
        const scriptName = get(events, ['scripts', skey]);
        const scriptCode = get(configs, ['script', scriptName]);
        if (scriptCode) {
          exec(scriptCode);
        } else {
          console.warn('[' + scriptName + '] not found.');
        }
      });
    });
  });
};

const pushPageScript = configs => name => {
  const pageScriptName = get(configs, ['page', name, 'script']);
  const pageScript = [get(configs, ['script', pageScriptName])];
  const pageScriptParam = get(configs, ['page', name, 'param']); 
  if (pageScriptParam) {
    pageScript.push(JSON.parse(pageScriptParam)) 
  }
  if (pageScript) {
    pageScripts.push(pageScript);
  }
};

const initPageScript = () => 
  setTimeout(() => pageScripts.forEach(script => {
    if (script[1]) {
        i13nDispatch('config/set', {
          i13nCbParams: script[1],
        });
    }
    exec(script[0])
}))

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
  const match = router.match(url);
  if (match) {
    match.fn();
  }
};

const initTags = configs => {
  win().i13n = {
    dispatch: i13nDispatch,
    query,
  };
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

const actionHandler = (state, action) => {
  let I13N = get(action, ['params', 'I13N']);
  const i13nCb = get(action, ['params', 'i13nCb']);
  const lazeInfo = get(action, ['params', 'lazeInfo']);
  if ('function' === typeof i13nCb) {
    I13N = i13nCb(
      state.get('lastEvent'),
      get(I13N, null, {}),
      state.get('i13nCbParams'),
      i13nStore,
    );
    delete action.params.i13nCb;
  }
  if (lazeInfo) {
    I13N.lazeInfo = lazeInfo;
  }
  if (I13N) {
    state = state.set('I13N', I13N);
  }
  if (get(action, ['params', 'lazy'])) {
    set(action, ['params', 'I13N'], I13N);
    i13nStore.pushLazyAction(action);
  }
  return state.delete('lastEvent').delete('i13nCbParams');
};

const impressionHandler = (state, action) => {
  console.warn('view', state.get('pvid'));
  return state;
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
