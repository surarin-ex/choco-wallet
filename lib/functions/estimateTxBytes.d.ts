/**
 * トランザクションの入力・出力のタイプ、入出力の個数から作成されるトランザクションのバイト数を推定する。
 * (使用例) estimateTxBytes( { "P2SH-P2WPKH": 2 }, { "P2PKH": 1, "P2SH": 1 } )
 * @param inputs (例) { "P2SH-P2WPKH": 2 }
 * @param outputs (例) { "P2PKH": 1, "P2SH": 1 } / keyには出力のタイプ、valueには出力数。
 */
declare const estimateTxBytes: (inputs: {
    P2PKH?: number;
    P2WPKH?: number;
    "P2SH-P2WPKH"?: number;
}, outputs: {
    P2SH?: number;
    P2PKH?: number;
    P2WPKH?: number;
    P2WSH?: number;
}) => number;
export default estimateTxBytes;
