import Utxo from "../interfaces/utxo";
import BigNumber from "bignumber.js";

/**
 * UTXOのamountの合計値を計算する
 * @param utxos UTXOの配列
 */
const getUtxosValue = (utxos: Utxo[]): string => {
  const amount = utxos.reduce((sum, utxo): string => {
    return new BigNumber(sum).plus(utxo.amount).toString();
  }, "0");
  return amount;
};

export default getUtxosValue;
