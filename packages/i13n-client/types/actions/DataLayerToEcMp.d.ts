export function getEcImpressionsData(impressions: any, config: any): {};
export function getEcStepData(checkout: any, checkout_option: any, config: any): {
    cos: any;
    col: any;
    pa: string;
};
export function getItemsData(items: any, itemKey: any, itemCb: any, config: any): {};
export function getEcPromotionData(promoView: any, promoClick: any): {
    promoa: string;
};
export function setOnePromotion(key: any, data: any, item: any): void;
export function setOneProduct(key: any, data: any, item: any, config: any): void;
export function getEcPurchaseData(purchase: any, refund: any, config: any): {
    pa: string;
    ti: any;
    ta: any;
    tr: any;
    tt: any;
    ts: any;
    tcc: any;
} | {
    pa: string;
    ti: any;
    ta?: undefined;
    tr?: undefined;
    tt?: undefined;
    ts?: undefined;
    tcc?: undefined;
};
export function getEcActionData(options: any, action: any, config: any): any;
export function getEcData(config: any): any;
