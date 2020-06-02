import callfunc from "call-func";
import { initMap } from "get-object-value";

let evElCount = 1;
let evOptCount = 1;

const i13nIdKey = "data-i13n-id";
const i13nEventMap = {};
const keys = Object.keys;

const initEventObj = el => {
  let i13nElId = el.getAttribute ? el.getAttribute(i13nIdKey) : el[i13nIdKey];
  if (!i13nElId) {
    i13nElId = evElCount;
    evElCount++;
    if (el.setAttribute) {
      el.setAttribute(i13nIdKey, i13nElId);
    } else {
      el[i13nIdKey] = i13nElId;
    }
  }
  const obj = i13nEventMap[i13nElId] || new I13NEvent(i13nElId, el);
  i13nEventMap[i13nElId] = obj;
  return obj;
};

class I13NEvent {
  optionMap = {};
  typeMap = {};
  constructor(id, el) {
    this.id = id;
    this.el = el;
  }

  addEventListener = (type, func, ...options) => {
    const thisOptId = evOptCount;
    const thisTypeMap = initMap(this.typeMap)(type, []);
    const optionMap = this.optionMap;
    evOptCount++;
    optionMap[thisOptId] = [type, func, ...options];
    thisTypeMap.push(thisOptId);
    callfunc(this.el.addEventListener, optionMap[thisOptId], this.el);
    return thisOptId;
  };

  removeEventListener = (typeOrId, func, ...options) => {
    const optionMap = this.optionMap;
    let thisOptions;
    let id;
    if (!isNaN(typeOrId) && optionMap[typeOrId]) {
      id = typeOrId;
      thisOptions = optionMap[id];
    } else {
      thisOptions = [typeOrId, func, ...options];
    }
    callfunc(this.el.removeEventListener, thisOptions, this.el);
    if (id) {
      const type = thisOptions[0];
      const thisTypeMap = initMap(this.typeMap)(type, []);
      this.typeMap[type] = thisTypeMap.filter(item => item != id);
      delete optionMap[id];
    }
  };

  cleanAll(type) {
    const optionMap = this.optionMap;
    if (null != type) {
      if (this.typeMap[type]) {
        this.typeMap[type].forEach(key => {
          this.removeEventListener(key);
        });
      }
    } else {
      keys(optionMap).forEach(key => {
        this.removeEventListener(key);
      });
    }
  }
}

const register = el => {
  const obj = initEventObj(el);
  return obj;
};

const cleanAllRegister = type => {
  keys(i13nEventMap).forEach(key => {
    i13nEventMap[key].cleanAll(type);
  });
};

export default register;
export { cleanAllRegister };
