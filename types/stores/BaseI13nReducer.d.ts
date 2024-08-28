export default BaseI13nReducer;
export type StoreObject<StateType, ActionType> = import("reshow-flux-base").StoreObject<StateType, ActionType>;
export type DispatchFunction<StateType, ActionType> = import("reshow-flux-base").DispatchFunction<StateType, ActionType>;
export type StateType = any;
export type ActionObject = import("reshow-flux-base").ActionObject;
/**
 * @template StateType
 * @template ActionType
 * @typedef {import("reshow-flux-base").StoreObject<StateType, ActionType>} StoreObject
 */
/**
 * @template StateType
 * @template ActionType
 * @typedef {import("reshow-flux-base").DispatchFunction<StateType, ActionType>} DispatchFunction
 */
/**
 * @typedef {Object<sinon,any>} StateType
 */
/**
 * @typedef {import("reshow-flux-base").ActionObject} ActionObject
 */
declare class BaseI13nReducer {
    /**
     * @abstract
     * @type {StoreObject<StateType, ActionObject>}
     */
    store: StoreObject<StateType, ActionObject>;
    /**
     * @abstract
     * @param {StateType} _state
     * @param {object} _paramsMap
     */
    mergeMap(_state: StateType, _paramsMap: object): void;
    dispatch(action: import("reshow-flux-base/types/type").DispatchAction<StateType, ActionType>, actionParams?: import("reshow-flux-base/types/type").Payload): StateType;
    /**
     * @param {StateType} state
     * @param {ActionObject} _action
     */
    sendBeacon(state: StateType, _action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    initDone(state: StateType, action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    processImpression(state: StateType, action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    processAction(state: StateType, action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    handleInit(state: StateType, action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    handleImpression(state: StateType, action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    handleAction(state: StateType, action: ActionObject): any;
    /**
     * @param {StateType} state
     * @param {ActionObject} action
     */
    reduce(state: StateType, action: ActionObject): any;
}
