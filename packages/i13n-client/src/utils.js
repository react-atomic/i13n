import {i13nDispatch} from 'i13n';
import {getNum as Num} from 'to-percent-js';
import {removeEmpty} from 'array.merge';
import query, {queryFrom} from 'css-query-selector';
import {getUrl} from 'seturl';
import getCookie from 'get-cookie';
import getRandomId from 'get-random-id';
import get, {toJS} from 'get-object-value';

// local
import {lStorage, sStorage} from './storage';
import logError from './logError';
import text from './text';
import getOptionText from './getOptionText';
import getElValue from './getElValue';
import getRadioValue from './getRadioValue';
import delegate from './delegate';
import lazyAttr from './lazyAttr';
import parseJson from './parseJson';

// constant
const keys = Object.keys;

const merge = (...args) => {
  let results = {};
  args.forEach(a => (results = {...results, ...a}));
  return results;
};

const error = message => logError({message}, 'CustomError');

const arrayFrom = arr => [...arr];

const objectToArray = obj => keys(obj).map(key => obj[key]);

const getNum = s => Num(text(s));

const joinCategory = arr =>
  arr.map(item => text(item).replace('/', '-')).join('/');

const utils = () => {
  const o = {
    dispatch: i13nDispatch,
    isArray: Array.isArray,
    merge,
    error,
    arrayFrom,
    objectToArray,
    getNum,
    joinCategory,
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
    parseJson,
    lStorage,
    sStorage,
  };
  return o;
};

export default utils;
