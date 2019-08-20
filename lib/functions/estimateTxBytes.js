"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * トランザクションの入力・出力のタイプ、入出力の個数から作成されるトランザクションのバイト数を推定する。
 * (使用例) estimateTxBytes( { "P2SH-P2WPKH": 2 }, { "P2PKH": 1, "P2SH": 1 } )
 * @param inputs (例) { "P2SH-P2WPKH": 2 }
 * @param outputs (例) { "P2PKH": 1, "P2SH": 1 } / keyには出力のタイプ、valueには出力数。
 */
var estimateTxBytes = function (inputs, outputs) {
    var totalWeight = 0;
    var hasWitness = false;
    var inputCount = 0;
    var outputCount = 0;
    // 圧縮公開鍵の使用を前提としている
    var types = {
        inputs: {
            P2PKH: 148 * 4,
            P2WPKH: 108 + 41 * 4,
            "P2SH-P2WPKH": 108 + 64 * 4 // base size = 32(hash) + 4(index) + 1(script bytes) + 23(ScriptPubkey) = 64bytes, witness size = 1(compact size) + 73(signature) + 34(compressed pubkey) = 108bytes
        },
        outputs: {
            P2SH: 32 * 4,
            P2PKH: 34 * 4,
            P2WPKH: 31 * 4,
            P2WSH: 43 * 4 // 8(value) + 1(ScriptPubkey bytes) + 34(ScriptPubkey) = 43bytes
        }
    };
    // 入力数・出力数のチェック
    var checkUInt53 = function (n) {
        if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0)
            throw new RangeError("value out of range");
    };
    // 入力数・出力数を表す可変長整数のバイト数
    var varIntLength = function (number) {
        checkUInt53(number);
        return number < 0xfd
            ? 1
            : number <= 0xffff
                ? 3
                : number <= 0xffffffff
                    ? 5
                    : 9;
    };
    // inputのサイズ計算
    Object.keys(inputs).forEach(function (key) {
        checkUInt53(inputs[key]);
        totalWeight += types.inputs[key] * inputs[key];
        inputCount += inputs[key];
        if (key.indexOf("W") >= 0)
            hasWitness = true;
    });
    // outputのサイズ計算
    Object.keys(outputs).forEach(function (key) {
        checkUInt53(outputs[key]);
        totalWeight += types.outputs[key] * outputs[key];
        outputCount += outputs[key];
    });
    if (hasWitness)
        totalWeight += 2; // markerとflag
    totalWeight += 8 * 4; // version(4byte)とlocktime(4byte)が合計で8byte
    totalWeight += varIntLength(inputCount) * 4; // inputの個数を表す可変長整数の重み
    totalWeight += varIntLength(outputCount) * 4; // outputの個数を表す可変長整数の重み
    return Math.ceil(totalWeight / 4);
};
exports.default = estimateTxBytes;
