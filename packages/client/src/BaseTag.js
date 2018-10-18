import get from 'get-object-value';

const toJS = v => (v && v.toJS ? v.toJS() : v);

class BaseTag {
  key = null;
  store = null;
  register(store, key) {
    this.key = key;
    this.store = store;
    store.addListener(this.init.bind(this), 'init');
    store.addListener(this.action.bind(this), 'action');
    store.addListener(this.impression.bind(this), 'impression');
  }

  getStore() {
    return this.store;
  }

  getState() {
    return this.getStore().getState();
  }

  getKey() {
    return this.key;
  }

  getTagData() {
    const state = this.getState();
    const key = this.getKey();
    const tagData = state
      .get('tag')
      .get(key)
      .toJS();
    return tagData;
  }

  getClone(key) {
    const state = this.getState();
    const data = get(toJS(state.get(key)), null, {});
    return JSON.parse(JSON.stringify(data));
  }

  init() {}

  action() {}

  impression() {}
}

export default BaseTag;
export {toJS};
