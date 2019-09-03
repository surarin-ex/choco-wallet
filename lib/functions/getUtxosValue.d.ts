import Utxo from "../interfaces/utxo";
/**
 * UTXOのamountの合計値を計算する
 * @param utxos UTXOの配列
 */
declare const getUtxosValue: (utxos: Utxo[]) => string;
export default getUtxosValue;
