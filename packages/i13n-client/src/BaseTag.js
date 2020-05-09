import {toMap} from 'get-object-value';

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
    tagData.tagId = state.get('tagId');
    tagData.needCheckTagId = state.get('needCheckTagId');
    tagData.version = state.get('version');
    tagData.mpHost = tagData.mpHost || state.get('mpHost');
    tagData.defaultMpHost = state.get('defaultMpHost');
    return tagData;
  }

  getClone(key) {
    const state = this.getState();
    const data = toMap(state.get(key));
    return JSON.parse(JSON.stringify(data));
  }

  init() {}

  action() {}

  impression() {}
}

export default BaseTag;
