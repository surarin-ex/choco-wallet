import Utxo from "../interfaces/utxo";
/**
 * Single Random Draw アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はselectedUtxoに空の配列が返される。
 * @param options 引数のオブジェクト
 */
declare const singleRandomDraw: (options: {
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
export default singleRandomDraw;
