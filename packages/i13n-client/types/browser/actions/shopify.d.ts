export default shopify;
declare namespace shopify {
    export { getStepNo };
    export { getStepName };
    export { getShopId };
    export { getPage };
    export { getUid };
    export { getGaId };
    export { getDocUrl };
    export { getCurrency };
    export { getClientId };
}
declare function getStepNo(): 2 | 1 | 3;
declare function getStepName(): any;
declare function getShopId(): any;
declare function getPage(): any;
declare function getUid(): any;
declare function getGaId(): any;
declare function getDocUrl(): string;
declare function getCurrency(): any;
declare function getClientId(): string;
