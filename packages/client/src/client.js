import {i13nDispatch, i13nStore} from './index'
const win = window
win.i13nDispatch = i13nDispatch

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

const initHandler = (state, action) =>
{
    console.log('init')
    return state
}

i13nDispatch(
    'config/set',
    {
        initHandler,
        actionHandler,
        impressionHandler,
    }
)
