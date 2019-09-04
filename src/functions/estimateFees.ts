import estimateTxBytes from "./estimateTxBytes";

/**
 * 手数料を推定する関数
 * @param options 引数のオブジェクト
 */
const estimateFees = (options: {
  inputLength: number;
  outputLength: number; // おつりの部分は除く
  hasChange: boolean;
  feeRate: number;
  inputType: string;
  outputType: string;
}): string => {
  const inputs = {};
  const outputs = {};
  inputs[options.inputType] = options.inputLength;
  outputs[options.outputType] = options.outputLength;
  if (options.hasChange) {
    const changeType =
      options.inputType.slice(0, 4) === "P2SH" ? "P2SH" : options.inputType;
    if (changeType === options.outputType) {
      outputs[changeType]++;
    } else {
      outputs[changeType] = 1;
    }
  }
  const estimateFees = (
    estimateTxBytes(inputs, outputs) * options.feeRate
  ).toString();
  if (estimateFees === "NaN") {
    throw new Error("inputTypeまたはoutputTypeが不正です");
  }
  return estimateFees;
};

export default estimateFees;
