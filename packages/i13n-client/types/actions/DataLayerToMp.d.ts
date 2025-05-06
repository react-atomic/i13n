export function resetSeq(i?: number): void;
export default DataLayerToMp;
declare class DataLayerToMp {
    /**
     * @see https://support.google.com/analytics/answer/14240153?hl=en
     * @param {object} beaconOption
     */
    getActionData(beaconOption: object): {};
    /**
     *
     * @param {object} internalProps
     * @param {object} beaconOption
     */
    getMp(internalProps: object, beaconOption: object): any;
}
