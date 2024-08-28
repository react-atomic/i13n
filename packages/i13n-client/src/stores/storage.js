import { SimpleMap } from "reshow-map";
import { T_NULL } from "reshow-constant";

export let sStore = new SimpleMap(T_NULL, true);
export let lStore = new SimpleMap(T_NULL, true);

export const setSStore = (o) => (sStore = o);
export const setLStore = (o) => (lStore = o);
