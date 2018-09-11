import {Dispatcher} from 'reshow-flux-base';

const instance = new Dispatcher();
export default instance;

export const i13nDispatch = instance.dispatch.bind(instance);
