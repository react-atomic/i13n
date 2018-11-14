import {toMap} from 'get-object-value';
import lazyAttr from './lazyAttr';

const _prods = lazyAttr('__prods');
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

const lazyProducts = state => {
  const arrP = toMap(_prods());
  const I13N = toMap(state.get('I13N'));
  const i13nPage = toMap(state.get('i13nPage'));
  [i13nPage.impressions, i13nPage.detailProducts, I13N.products].forEach(
    prods => {
      if (prods) {
        storeProducts(prods, arrP);
      }
    },
  );
  _prods(arrP);
  return state.set('I13N', I13N).set('i13nPage', i13nPage);
};
export default lazyProducts;
