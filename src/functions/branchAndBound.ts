import Utxo from "../interfaces/utxo";
import BigNumber from "bignumber.js";
import estimateFees from "./estimateFees";
import singleRandomDraw from "./singleRandomDraw";
import getUtxosValue from "./getUtxosValue";

/**
 * Branch and Bound アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はエラーがthrowされる。
 * @param options 引数のオブジェクト
 */
const branchAndBound = (options: {
  utxos: Utxo[];
  feeRate: number;
  inputType: string;
  outputType: string;
  amount: string;
  minOutValue: string;
}): { selectedUtxos: Utxo[]; hasChange: boolean; fees: string } => {
  let selectedUtxos = [] as Utxo[];
  let bnbTries = 1000000;
  const costOfHeader = estimateFees({
    inputLength: 0,
    outputLength: 0,
    hasChange: false,
    ...options
  });
  const costPerOutput = new BigNumber(
    estimateFees({
      inputLength: 0,
      outputLength: 1,
      hasChange: false,
      ...options
    })
  ).minus(costOfHeader);
  const costPerInput = new BigNumber(
    estimateFees({
      inputLength: 1,
      outputLength: 0,
      hasChange: false,
      ...options
    })
  ).minus(costOfHeader);
  const costPerChange = new BigNumber(
    estimateFees({
      inputLength: 0,
      outputLength: 0,
      hasChange: true,
      ...options
    })
  ).minus(costOfHeader);
  const utxoSorted = Array.from(options.utxos).sort((a, b): number => {
    return new BigNumber(b.amount).minus(a.amount).toNumber();
  });

  // effective valueを計算する関数
  const getEffValue = (utxo: Utxo): BigNumber => {
    const effValue = new BigNumber(utxo.amount).minus(costPerInput);
    return effValue;
  };

  // Branch and Bound アルゴリズムによるUTXOの検索をする関数
  const bnbSearch = (
    depth: number,
    selectedUtxos: Utxo[],
    effValue: BigNumber,
    amount: BigNumber
  ): Utxo[] => {
    const targetForMatch = amount.plus(costOfHeader).plus(costPerOutput);
    const matchRange = costPerInput.plus(costPerChange);
    bnbTries--;
    if (effValue.gt(targetForMatch.plus(matchRange))) {
      return [];
    } else if (effValue.gte(targetForMatch)) {
      return selectedUtxos;
    } else if (bnbTries <= 0) {
      return [];
    } else if (depth >= utxoSorted.length) {
      return [];
    } else {
      // ランダムに次のブランチを探索する
      const randomBoolean = Math.random() >= 0.5;
      if (randomBoolean) {
        // 先にUTXOを含める場合のブランチを探索し、その次に含めない場合のブランチを探索する
        const nextUtxos = Array.from(selectedUtxos);
        nextUtxos.push(utxoSorted[depth]);
        const nextEffValue = effValue.plus(getEffValue(utxoSorted[depth]));
        const withThis = bnbSearch(depth + 1, nextUtxos, nextEffValue, amount);
        if (withThis.length !== 0) {
          return withThis;
        } else {
          const withoutThis = bnbSearch(
            depth + 1,
            Array.from(selectedUtxos),
            effValue,
            amount
          );
          if (withoutThis.length !== 0) {
            return withoutThis;
          }
        }
      } else {
        // 先にUTXOを含めない場合のブランチを探索し、その次に含める場合のブランチを探索する
        const withoutThis = bnbSearch(
          depth + 1,
          Array.from(selectedUtxos),
          effValue,
          amount
        );

        if (withoutThis.length !== 0) {
          return withoutThis;
        } else {
          const nextUtxos = Array.from(selectedUtxos);
          nextUtxos.push(utxoSorted[depth]);
          const nextEffValue = effValue.plus(getEffValue(utxoSorted[depth]));
          const withThis = bnbSearch(
            depth + 1,
            nextUtxos,
            nextEffValue,
            amount
          );
          if (withThis.length !== 0) {
            return withThis;
          }
        }
      }
      return [];
    }
  };

  selectedUtxos = bnbSearch(
    0,
    [],
    new BigNumber(0),
    new BigNumber(options.amount)
  );
  if (selectedUtxos.length > 0) {
    return {
      selectedUtxos,
      hasChange: false,
      fees: new BigNumber(getUtxosValue(selectedUtxos))
        .minus(options.amount)
        .toString()
    };
  } else {
    const result = singleRandomDraw(options);
    return result;
  }
};

export default branchAndBound;
