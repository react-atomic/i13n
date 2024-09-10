// @ts-check
import { SimpleMap } from "reshow-map";
import { T_UNDEFINED } from "reshow-constant";
import { DeferredActionUtil } from "i13n";

export let sStore = new SimpleMap(T_UNDEFINED, true);
export let lStore = new SimpleMap(T_UNDEFINED, true);

export const setSStore = (/**@type any*/ o) => (sStore = o);
export const setLStore = (/**@type any*/ o) => (lStore = o);

export const deferredStore = () => DeferredActionUtil(lStore);

