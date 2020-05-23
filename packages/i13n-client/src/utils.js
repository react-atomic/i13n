import { i13nDispatch, getTime } from "i13n";
import { removeEmpty } from "array.merge";
import query, { queryFrom } from "css-query-selector";
import { getUrl } from "seturl";
import getCookie from "get-cookie";
import getRandomId from "get-random-id";
import get, { toMap } from "get-object-value";
import router from "url-route";

// local
import arraySearch from "./arraySearch";
import delegate from "./delegate";
import expireCallback from "./expireCallback";
import execScript from "./execScript";
import { lStorage, sStorage } from "./storage";
import logError from "./logError";
import getNum from "./getNum";
import getOptionText, { getOptionEl } from "./getOptionText";
import getElValue, { getElNumValue } from "./getElValue";
import getRadioValue from "./getRadioValue";
import getClientId from "./getClientId";
import getUserId from "./getUserId";
import lazyAttr from "./lazyAttr";
import parseJson from "./parseJson";
import req from "./req";
import storeCbParams from "./storeCbParams";
import text from "./text";

// constant
const keys = Object.keys;

const merge = (...args) => {
  let results = {};
  args.forEach(a => (results = { ...results, ...a }));
  return results;
};

const error = message => logError({ message }, "CustomError");

const arrayFrom = arr => [...arr];

const objectToArray = obj => keys(obj || {}).map(key => obj[key]);

const arrayToObject = (arr, key) => {
  const map = {};
  if (arr && arr.forEach) {
    arr.forEach(a=>{
      if (a.hasOwnProperty(key)) {
        map[a[key]]=a
      }
    });
  }
  return map;
}

const joinCategory = arr =>
  arr.map(item => text(item).replace("/", "-")).join("/");

const utils = () => {
  const o = {
    dispatch: i13nDispatch,
    isArray: Array.isArray,
    arrayToObject,
    arrayFrom,
    arraySearch,
    delegate,
    error,
    execScript,
    expireCallback,
    get,
    getNum,
    getUrl,
    getOptionText,
    getOptionEl,
    getElValue,
    getElNumValue,
    getRadioValue,
    getCookie,
    getRandomId,
    getClientId,
    getUserId,
    getTime,
    joinCategory,
    keys,
    lazyAttr,
    lStorage,
    merge,
    objectToArray,
    parseJson,
    query,
    queryFrom,
    removeEmpty,
    router,
    req,
    sStorage,
    storeCbParams,
    text,
    toMap
  };
  return o;
};

export default utils;
