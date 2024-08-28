export function getCookieClientId(): string;
export function getReferrer(oDoc?: ReferrerType & {
    [x: string]: any;
}): {
    dr: any;
};
export function getBrowserMpInfo(): {
    dl: any;
    ul: string;
    fbp: string;
    fbc: string;
    vp: string;
    je: number;
    de: string;
    dt: string;
    sd: string;
    sr: string;
    _gid: string;
    dr: any;
};
export type ReferrerType = {
    referrer?: string | undefined;
};
