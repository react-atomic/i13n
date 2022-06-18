import { SimpleMap } from "reshow-flux-base";
import { T_NULL } from "reshow-constant";

let sStore = new SimpleMap(T_NULL, true);
let lStore = new SimpleMap(T_NULL, true);

const setSStore = (o) => (sStore = o);
const setLStore = (o) => (lStore = o);

export { lStore, sStore, setSStore, setLStore };
