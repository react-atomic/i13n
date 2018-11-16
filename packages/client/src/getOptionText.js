import query from 'css-query-selector';
import get from 'get-object-value';

const getOptionText = sel => {
  const thisSel = query.el(sel);
  if (!sel) {
    return;
  }
  const val = get(thisSel, ['value'], '');
  return get(thisSel.querySelector("option[value='" + val + "']"), ['text'], '');
};

export default getOptionText;
