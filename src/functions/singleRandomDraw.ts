import Utxo from "../interfaces/utxo";
import shuffleArray from "./shuffleArray";
import getUtxosValue from "./getUtxosValue";
import BigNumber from "bignumber.js";
import estimateFees from "./estimateFees";

/**
 * Single Random Draw アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はselectedUtxoに空の配列が返される。
 * @param options 引数のオブジェクト
 */
const singleRandomDraw = (options: {
  utxos: Utxo[];
  feeRate: number;
  inputType: string;
  outputType: string;
  amount: string;
  minOutValue: string;
}): { selectedUtxos: Utxo[]; hasChange: boolean; fees: string } => {
  const selectedUtxos = [] as Utxo[];
  const shuffledUtxos = shuffleArray(options.utxos);

  // UTXOの判定条件
  const isInsufficientInputs = (
    selectedUtxos: Utxo[],
    options: {
      feeRate: number;
      inputType: string;
      outputType: string;
      amount: string;
      minOutValue: string;
    },
    hasChange: boolean
  ): boolean => {
    const sumInput = new BigNumber(getUtxosValue(selectedUtxos));
    let requirement = new BigNumber(options.amount).plus(
      estimateFees(selectedUtxos, hasChange, options)
    );
    if (hasChange) {
      requirement = requirement.plus(options.minOutValue);
    }
    return sumInput.lt(requirement);
  };

  let isInSufficient = false;
  let hasChange = true;
  while (
    (isInSufficient = isInsufficientInputs(selectedUtxos, options, hasChange))
  ) {
    if (shuffledUtxos[0]) {
      selectedUtxos.push(shuffledUtxos[0]);
      shuffledUtxos.splice(0, 1);
    } else {
      break;
    }
  }

  if (!isInSufficient) {
    const fees = estimateFees(selectedUtxos, hasChange, options);
    return { selectedUtxos, hasChange, fees };
  } else {
    hasChange = false;
    isInSufficient = isInsufficientInputs(selectedUtxos, options, hasChange);
    if (!isInSufficient) {
      const fees = new BigNumber(getUtxosValue(selectedUtxos))
        .minus(options.amount)
        .toString();
      return { selectedUtxos, hasChange, fees };
    } else {
      throw new Error("残高不足です");
    }
  }
};

export default singleRandomDraw;
