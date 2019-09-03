"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
/**
 * UTXOのamountの合計値を計算する
 * @param utxos UTXOの配列
 */
var getUtxosValue = function (utxos) {
    var amount = utxos.reduce(function (sum, utxo) {
        return new bignumber_js_1.default(sum).plus(utxo.amount).toString();
    }, "0");
    return amount;
};
exports.default = getUtxosValue;
