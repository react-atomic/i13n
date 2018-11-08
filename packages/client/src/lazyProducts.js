import {toMap} from 'get-object-value';
import lazyAttr from './lazyAttr';

const _prods = lazyAttr('__prods');

const storeProducts = (products, arrP) => {
  products.forEach((p, key) => {
    if (!p.id) {
      return;
    }
    arrP[p.id] = {
      ...arrP[p.id],
      ...p,
    };
    products[key] = arrP[p.id];
  });
};

const lazyProducts = state => {
  const arrP = toMap(_prods());
  const I13N = toMap(state.get('I13N'));
  const i13nPage = toMap(state.get('i13nPage'));
  [I13N.products, i13nPage.impressions, i13nPage.detailProducts].forEach(
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
