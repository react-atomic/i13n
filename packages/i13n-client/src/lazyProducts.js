import {toMap} from 'get-object-value';
import {removeEmpty} from 'array.merge';
import utils from "./utils";

const {objectToArray, lazyAttr} = utils();
const sessionStore = lazyAttr('__prods');
const isArray = Array.isArray;

const storeProducts = (products, arrP) => {
  products.forEach((p, key) => {
    if (!p || !p.id) {
      return;
    }
    arrP[p.id] = {
      ...arrP[p.id],
      ...removeEmpty(p),
    };
    delete arrP[p.id].quantity;
    delete arrP[p.id].variant;
    delete arrP[p.id].position;
    products[key] = {...p, ...arrP[p.id]};
  });
};

const forEachStoreProducts = arr => {
  const arrP = toMap(sessionStore());
  ['impressions', 'detailProducts', 'products'].forEach( key => {
    const prods = isArray(arr[key]) ? arr[key] : objectToArray(arr[key]);

    if (prods.length) {
      storeProducts(prods, arrP);
    } else {
      delete arr[key];
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
