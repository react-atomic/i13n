class BaseTag
{
  register(store)
  {
    store.addListener(this.init.bind(this), 'init')
    store.addListener(this.action.bind(this), 'action')
    store.addListener(this.impression.bind(this), 'impression')
  }

  init(){}

  action(){}

  impression(){}
}

export default BaseTag
