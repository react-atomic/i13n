export default initLazyAction;
export type DispatchFunction<StateType, ActionType> = import("reshow-flux-base").DispatchFunction<StateType, ActionType>;
export type StateType = any;
export type ActionObject = import("reshow-flux-base").ActionObject;
/**
 * @param {Storage} storage
 */
declare function initLazyAction(storage: Storage): {
    process: <StateType, ActionType>(dispatch: DispatchFunction<StateType, ActionType>) => Storage;
    handleAction: (state: StateType, action: ActionObject) => any;
    getAll: () => any;
    getOne: (k: string) => any;
    push: (action: any, key: string) => void;
};
import { Storage } from "get-storage";
