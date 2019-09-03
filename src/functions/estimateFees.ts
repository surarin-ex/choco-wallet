import Utxo from "../interfaces/utxo";
import estimateTxBytes from "./estimateTxBytes";

// 手数料の推定
const estimateFees = (
  selectedUtxos: Utxo[],
  hasChange: boolean,
  options: {
    feeRate: number;
    inputType: string;
    outputType: string;
  }
): string => {
  const inputs = {};
  const outputs = {};
  inputs[options.inputType] = selectedUtxos.length;
  if (hasChange) {
    const changeType =
      options.inputType.slice(0, 4) === "P2SH" ? "P2SH" : options.inputType;
    outputs[changeType] = 1;
  }
  outputs[options.outputType] = 1;
  const estimateFees = (
    estimateTxBytes(inputs, outputs) * options.feeRate
  ).toString();
  return estimateFees;
};

export default estimateFees;
