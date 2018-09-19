import {i13nDispatch} from 'i13n'
import i13nStore from 'i13n/store'
import ini from 'parse-ini-string'
import {nest} from 'object-nested'
import exec from 'exec-script'
import get from 'get-object-value'
import query from 'css-query-selector'

import Router from './routes'
import req from './req'
import googleTag from './google.tag'
import usergramTag from './usergram.tag'

const win = () => window
const doc = () => document

const actionHandler = (state, action) =>
{
    console.log('action', action)
    return state
}

const impressionHandler = (state, action) =>
{
    console.log('view', state.get('pvid'))
    return state
}

const initRouter = configs =>
{
    const router = new Router();
    get(configs, ['routers', 'rule'], []).forEach(
      (rule, key) => {
        console.log(rule, key)
        router.addRoute(rule, ()=>{
          const pageName = get(configs, ['routers', 'name', key])
          const events = get(configs, ['page', pageName, 'events'])
          get(events, ['select'], []).forEach(
            (select, skey) => {
              const el = query.one(select)
              el.addEventListener(get(events, ['type', skey]),  e => {
                const scriptName = get(events, ['script', skey])
                const scriptCode = get(configs, ['script', scriptName])
                exec(scriptCode)
              })
            }
          )
        })
      }
    )
    const loc = doc().location 
    const url = loc.pathname+loc.search
    const match = router.match(url)
    if (match) {
      match.fn()
    }
}

const initHandler = (state, action) =>
{
    win().i13nDispatch = i13nDispatch
    googleTag.register(i13nStore)
    usergramTag.register(i13nStore)
    const iniPath = get(action, ['params', 'iniPath'])
    return view => {
      req(iniPath, req => e => {
          const text = req.responseText
          const accountConfig = nest(ini(text), '_')
          initRouter(accountConfig)
          state = state.merge(accountConfig)
          const nextState = view(state)
          i13nDispatch('config/set', nextState)
      })
      return state
    }
}

i13nDispatch(
    'config/set',
    {
        initHandler,
        actionHandler,
        impressionHandler,
    }
)

