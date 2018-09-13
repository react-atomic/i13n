import {i13nDispatch, i13nStore} from 'i13n'
import Router from './routes'
import ini from 'parse-ini-string'
import {nest} from 'object-nested'
import exec from 'exec-script'
import {create} from 'create-el'
import get from 'get-object-value'
import query from 'css-query-selector'


import req from './req'

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
                const innerHTML = get(configs, ['script', scriptName])
                const d = create('div')()({ innerHTML })
                exec(d)
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
    console.log(match)
}

const initHandler = (state, action) =>
{
    win().i13nDispatch = i13nDispatch

    return view => {
      req('/i13n/account.ini', req => e => {
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

i13nDispatch('view')
