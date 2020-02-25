import {i13nDispatch} from 'i13n';
import {getNum as Num} from 'to-percent-js';
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
import getOptionText, {getOptionEl} from './getOptionText';
import getElValue from './getElValue';
import getRadioValue from './getRadioValue';
import delegate from './delegate';
import lazyAttr from './lazyAttr';
import parseJson from './parseJson';
import storeCbParams from './storeCbParams';

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
    req,
    merge,
    error,
    execScript,
    arrayFrom,
    arraySearch,
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
    getOptionEl,
    getElValue,
    getRadioValue,
    getCookie,
    getRandomId,
    delegate,
    lazyAttr,
    text,
    toMap,
    parseJson,
    lStorage,
    sStorage,
    storeCbParams,
  };
  return o;
};

export default utils;
