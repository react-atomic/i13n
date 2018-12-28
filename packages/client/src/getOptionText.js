import query, {queryFrom} from 'css-query-selector';
import get from 'get-object-value';

const getOptionText = sel => {
  const thisSel = query.el(sel);
  if (!thisSel) {
    return;
  }
  const val = get(thisSel, ['value'], '');
  return get(queryFrom(thisSel).one("option[value='" + val + "']"), ['text'], '');
};

export default getOptionText;
