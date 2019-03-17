import {sessionStorage, Storage} from 'get-storage';
import {toMap} from 'get-object-value';
import {UNDEFINED} from 'reshow-constant';

const sStore = new Storage(sessionStorage);
const lazyKey = 'lazyAttr';
const lazyAttr = key => value => {
  const arr = toMap(sStore.get(lazyKey));
  if (UNDEFINED === typeof key) {
    return arr;
  }
  if (UNDEFINED !== typeof value) {
    arr[key] = value;
    sStore.set(lazyKey, arr);
  }
  return arr[key];
};

export default lazyAttr;
