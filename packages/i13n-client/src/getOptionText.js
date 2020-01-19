import {queryFrom} from 'css-query-selector';
import get from 'get-object-value';
import getElValue from './getElValue';

const getOptionText = sel =>
  get(
    queryFrom(sel).one("option[value='" + getElValue(sel) + "']"),
    ['text'],
    '',
  );

export default getOptionText;
