export let sStore: SimpleMap;
export let lStore: SimpleMap;
export function setSStore(o: any): any;
export function setLStore(o: any): any;
export const deferredStore: {
    process: <StateType, ActionType>(dispatch: import("../../node_modules/i13n/types/DeferredActionUtil").DispatchFunction<StateType, ActionType>) => any;
    handleAction: (state: any, action: import("../../node_modules/reshow-flux-base/types/type").ActionObject) => any;
    getAll: () => any;
    getOne: (k: string) => any;
    push: (action: any, key?: string | undefined) => void;
};
export function deferredDispatch(action: any, actionParams?: any | undefined): void;
import { SimpleMap } from "reshow-map";
