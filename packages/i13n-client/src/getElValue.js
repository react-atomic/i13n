import get from 'get-object-value';
import query, {queryFrom} from 'css-query-selector';

const getElValue = (el, from) => {
  let q = query;
  if (from) {
    q = queryFrom(from);
  }
  return get(q.el(el), ['value']);
};

export default getElValue;
