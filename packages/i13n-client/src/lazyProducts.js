import {toMap} from 'get-object-value';
import {removeEmpty} from 'array.merge';

import lazyAttr from './lazyAttr';

const sessionStore = lazyAttr('__prods');
const isArray = Array.isArray;

const storeProducts = (products, arrP) => {
  if (!products || !isArray(products)) {
    return;
  }
  products.forEach((p, key) => {
    if (!p || !p.id) {
      return;
    }
    arrP[p.id] = {
      ...arrP[p.id],
      ...removeEmpty(p),
    };
    products[key] = {...p, ...arrP[p.id]};
  });
};

const forEachStoreProducts = arr => {
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
  const I13N = forEachStoreProducts(toMap(state.get('I13N')));
  const i13nPage = forEachStoreProducts(toMap(state.get('i13nPage')));
  return state.set('I13N', I13N).set('i13nPage', i13nPage);
};
export default lazyProducts;
export {forEachStoreProducts};
