import Utxo from "../interfaces/utxo";
declare const estimateFees: (selectedUtxos: Utxo[], hasChange: boolean, options: {
    feeRate: number;
    inputType: string;
    outputType: string;
}) => string;
export default estimateFees;
