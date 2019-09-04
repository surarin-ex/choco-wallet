import Utxo from "../interfaces/utxo";
/**
 * Branch and Bound アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はエラーがthrowされる。
 * @param options 引数のオブジェクト
 */
declare const branchAndBound: (options: {
    utxos: Utxo[];
    feeRate: number;
    inputType: string;
    outputType: string;
    amount: string;
    minOutValue: string;
}) => {
    selectedUtxos: Utxo[];
    hasChange: boolean;
    fees: string;
};
export default branchAndBound;
