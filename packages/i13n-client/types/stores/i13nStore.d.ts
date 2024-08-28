export const i13nStore: {
    getClone: (key: string) => any;
    reset: () => SimpleMap;
    getState: () => SimpleMap;
    addListener: import("reshow-flux-base/types/type").EmitterAddCall<SimpleMap, any>;
    removeListener: import("reshow-flux-base/types/type").EmitterRemoveCall<SimpleMap, any>;
};
export const i13nDispatch: import("reshow-flux-base/types/createReducer").DispatchFunction<SimpleMap, any>;
/**
 * @param {SimpleMap} state
 * @param {object} jsObj
 */
export function mergeMap(state: SimpleMap, jsObj: object): SimpleMap;
import { SimpleMap } from "reshow-map";
