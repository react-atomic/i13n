export default req;
/**
 * @param {string} url
 * @param {?Function} [callback]
 * @param {string} method
 * @param {string} query
 */
declare function req(url: string, callback?: Function | null, method?: string, query?: string): boolean;
/**
 * @param {string} url
 * @param {Object<string, any>=} data
 */
export function beacon(url: string, data?: {
    [x: string]: any;
} | undefined, ajaxReq?: (url: string, callback?: Function | null, method?: string, query?: string) => boolean, imgTag?: (url: string) => void): void;
export function setFirst(bool: boolean): boolean;
