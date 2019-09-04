/**
 * 手数料を推定する関数
 * @param options 引数のオブジェクト
 */
declare const estimateFees: (options: {
    inputLength: number;
    outputLength: number;
    hasChange: boolean;
    feeRate: number;
    inputType: string;
    outputType: string;
}) => string;
export default estimateFees;
