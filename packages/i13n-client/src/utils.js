import {i13nDispatch} from 'i13n';
import {getNum} from 'to-percent-js';
import {removeEmpty} from 'array.merge';
import query, {queryFrom} from 'css-query-selector';
import {getUrl} from 'seturl';
import getCookie from 'get-cookie';
import getRandomId from 'get-random-id';
import get, {toJS} from 'get-object-value';

// local
import logError from './logError';
import text from './text';
import getOptionText from './getOptionText';
import getElValue from './getElValue';
import getRadioValue from './getRadioValue';
import delegate from './delegate';
import lazyAttr from './lazyAttr';

// constant
const keys = Object.keys;

const utils = () => {
  const o = {
    merge: (...args) => {
      let results = {};
      args.forEach(a => (results = {...results, ...a}));
      return results;
    },
    error: message => logError({message}, 'CustomError'),
    arrayFrom: arr => [...arr],
    objectToArray: obj => keys(obj).map(key => obj[key]),
    getNum: s => getNum(text(s)),
    joinCategory: arr =>
      arr.map(item => text(item).replace('/', '-')).join('/'),
    dispatch: i13nDispatch,
    isArray: Array.isArray,
    keys,
    removeEmpty,
    query,
    queryFrom,
    getUrl,
    get,
    getOptionText,
    getElValue,
    getRadioValue,
    getCookie,
    getRandomId,
    delegate,
    lazyAttr,
    text,
    toJS,
    parseJson: strJson => {
      try {
        return JSON.parse(strJson);
      } catch (e) {
        logError(e, 'I13nScriptErr');
      }
    },
  };
  return o;
};

export default utils;
