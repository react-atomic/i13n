import get from 'get-object-value'

class BaseTag
{
  key = null
  store = null
  register(store, key)
  {
    this.key = key
    this.store = store
    store.addListener(this.init.bind(this), 'init')
    store.addListener(this.action.bind(this), 'action')
    store.addListener(this.impression.bind(this), 'impression')
  }

  getStore()
  {
    return this.store
  }

  getKey()
  {
    return this.key
  }

  getTagData()
  {
    const state = this.getStore().getState();
    const key = this.getKey();
    const tagData = get(state.get('tags'), [key])
    return tagData;
  }

  init(){}

  action(){}

  impression(){}
}

export default BaseTag
