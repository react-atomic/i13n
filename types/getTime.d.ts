export default getTime;
/**
 * @param {string=} s
 */
declare function getTime(s?: string | undefined): {
    toArray: () => (string | number)[];
    toString: () => string;
};
