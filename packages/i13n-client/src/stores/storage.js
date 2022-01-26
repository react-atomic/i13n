import { SimpleMap } from "reshow-flux-base";

let sStore = new SimpleMap();
let lStore = new SimpleMap();

const setSStore = (o) => (sStore = o);
const setLStore = (o) => (lStore = o);

export { lStore, sStore, setSStore, setLStore };
