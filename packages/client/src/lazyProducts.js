import {toMap} from 'get-object-value';
import lazyAttr from './lazyAttr';

const sessionStore = lazyAttr('__prods');
const keys = Object.keys;
const isArray = Array.isArray;

const storeProducts = (products, arrP) => {
  if (!products || !isArray(products)) {
    return;
  }
  products.forEach((p, key) => {
    if (!p || !p.id) {
      return;
    }
    const save = {};
    keys(p).forEach(fKey => {
      const field = p[fKey];
      if (field) {
        save[fKey] = field;
      }
    });
    arrP[p.id] = {
      ...arrP[p.id],
      ...save,
    };
    products[key] = {...p, ...arrP[p.id]};
  });
};

const forEachGoStore = arr => {
  const arrP = toMap(sessionStore());
  [arr.impressions, arr.detailProducts, arr.products].forEach(prods => {
    if (prods) {
      storeProducts(prods, arrP);
    }
  });
  sessionStore(arrP);
  return arr;
};

const lazyProducts = state => {
  const I13N = forEachGoStore(toMap(state.get('I13N')));
  const i13nPage = forEachGoStore(toMap(state.get('i13nPage')));
  return state.set('I13N', I13N).set('i13nPage', i13nPage);
};
export default lazyProducts;
export {forEachGoStore};
