export default logError;
/**
 * @params error object Error object
 * @params action string Error type
 */
declare function logError(error: any, action: any, name: any): void;
export function setDebugFlag(bool: any): any;
export function getDebugFlag(): boolean;
export const SCRIPT_ERROR: "I13nScriptErr";
export const ERROR_CATEGORY: "Error";
