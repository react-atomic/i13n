export function DeferredActionUtil(storage: StorageType): {
    process: <StateType, ActionType>(dispatch: DispatchFunction<StateType, ActionType>) => any;
    wrapActionHandler: (actionHandler: any) => (state: StateType, action: ActionObject) => any;
    getAll: () => any;
    getOne: (k: string) => any;
    push: (action: any, key?: string | undefined) => void;
};
export type DispatchFunction<StateType, ActionType> = import("reshow-flux-base").DispatchFunction<StateType, ActionType>;
export type StateType = any;
export type ActionObject = import("reshow-flux-base").ActionObject;
export type StorageType = {
    get: (arg0: string) => any;
    set: (arg0: string, arg1: any) => any;
};
