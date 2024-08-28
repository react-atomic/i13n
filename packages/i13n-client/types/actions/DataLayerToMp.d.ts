export function resetSeq(i?: number): void;
export default DataLayerToMp;
declare class DataLayerToMp {
    /**
     * @param {object} config
     */
    getActionData(config: object): {
        ec: any;
        ea: any;
        el: any;
        ev: number;
    };
    getItemsData(items: any, itemKey: any, itemCb: any, config: any): {};
    getPromotionsData: (promotions: any) => {};
    getEcPromotionData(promoView: any, promoClick: any): {
        promoa: string;
    };
    setOnePromotion: (key: any, data: any, item: any) => void;
    getProductsData: (products: any, config: any) => {};
    setOneProduct(key: any, data: any, item: any, config: any): void;
    getEcPurchaseData(purchase: any, refund: any, config: any): {
        pa: string;
        ti: any;
        ta: any;
        tr: number;
        tt: number;
        ts: number;
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
    getEcStepData(checkout: any, checkout_option: any, config: any): {
        cos: any;
        col: any;
        pa: string;
    };
    getEcActionData(options: any, action: any, config: any): any;
    getEcImpressionsData(impressions: any, config: any): {};
    getEcData(config: any): any;
    getMp(props: any, data: any): any;
}
