import {localStorage, sessionStorage, Storage} from 'get-storage';

const lStore = new Storage(localStorage);
const sStore = new Storage(sessionStorage);

export {lStore, sStore};
