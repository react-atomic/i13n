import { i13nDispatch, getTime } from "i13n";
import { removeEmpty } from "array.merge";
import query, { queryFrom } from "css-query-selector";
import { getUrl } from "seturl";
import getCookie from "get-cookie";
import getRandomId, { getDateObject, getTimestamp } from "get-random-id";
import get, { toMap } from "get-object-value";
import router from "url-route";
import { htmlDecode } from "html-entity-js";
import formSerialize from "form-serialize-js";

// local
import arraySearch from "./arraySearch";
import arrayToObject from "./arrayToObject";
import objectToArray from "./objectToArray";

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
import { getAllLazyProducts } from "./lazyProducts";
import lazyAttr from "./lazyAttr";
import parseJson from "./parseJson";
import req from "./req";
import register from "./register";
import storeCbParams from "./storeCbParams";
import text from "./text";

// constant
const keys = Object.keys;

const merge = (...args) => {
  let results = {};
  args.forEach((a) => (results = { ...results, ...a }));
  return results;
};

const error = (message) => logError({ message }, "CustomError");

const arrayFrom = (arr) => [...arr];

const joinCategory = (arr) =>
  arr?.map((item) => text(item).replace("/", "-")).join("/");

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
    formSerialize,
    get,
    getAllLazyProducts,
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
    getDateObject,
    getTimestamp,
    getTime,
    htmlDecode,
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
    req,
    register,
    router,
    sStorage,
    storeCbParams,
    text,
    toMap,
  };
  return o;
};

export default utils;
