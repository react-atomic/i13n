import {i13nDispatch} from 'i13n';
import {removeEmpty} from 'array.merge';
import query, {queryFrom} from 'css-query-selector';
import {getUrl} from 'seturl';
import getCookie from 'get-cookie';
import getRandomId from 'get-random-id';
import get, {toMap} from 'get-object-value';

// local
import arraySearch from './arraySearch';
import req from './req';
import execScript from './execScript';
import {lStorage, sStorage} from './storage';
import logError from './logError';
import text from './text';
import getNum from './getNum';
import getOptionText, {getOptionEl} from './getOptionText';
import getElValue, {getElNumValue} from './getElValue';
import getRadioValue from './getRadioValue';
import delegate from './delegate';
import lazyAttr from './lazyAttr';
import parseJson from './parseJson';
import storeCbParams from './storeCbParams';
import router from './Router';

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

const joinCategory = arr =>
  arr.map(item => text(item).replace('/', '-')).join('/');

const utils = () => {
  const o = {
    dispatch: i13nDispatch,
    isArray: Array.isArray,
    merge,
    error,
    execScript,
    arrayFrom,
    arraySearch,
    objectToArray,
    joinCategory,
    keys,
    removeEmpty,
    query,
    queryFrom,
    getNum,
    getUrl,
    get,
    getOptionText,
    getOptionEl,
    getElValue,
    getElNumValue,
    getRadioValue,
    getCookie,
    getRandomId,
    delegate,
    lazyAttr,
    text,
    toMap,
    parseJson,
    lStorage,
    router,
    req,
    sStorage,
    storeCbParams,
  };
  return o;
};

export default utils;
