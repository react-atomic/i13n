export function getCookieClientId(): string;
export function getReferrer(oDoc?: ReferrerType & {
    [x: string]: any;
}): {
    dr: any;
};
export function getClientHints(nav: Navigator): Promise<ClientHintType>;
export function browserMpHandler(d?: any): any;
export type ReferrerType = {
    referrer?: string | undefined;
};
export type ClientHintKeyType = "platform" | "platformVersion" | "architecture" | "model" | "uaFullVersion" | "bitness" | "fullVersionList" | "wow64" | "mobile";
export type ClientHintType = { [key in ClientHintKeyType]?: any; };
