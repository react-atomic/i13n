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
        ev: any;
    };
    getMp(props: any, data: any): any;
}
