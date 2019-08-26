"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var bclib = require("bitcoinjs-lib");
/**
 * 送金先のアドレスからアウトプットのタイプを取得するメソッド。
 * "p2pkh", "p2sh", "p2wpkh", "p2wsh"のいずれかが得られる。
 * 識別できない場合はエラーをthrowする。
 * @param toAddress 送金先のアドレス
 */
var getOutputType = function (toAddress) {
    var outputTypes = ["p2pkh", "p2sh", "p2wpkh", "p2wsh"];
    var returnType;
    outputTypes.forEach(function (type) {
        try {
            bclib.payments[type]({ address: toAddress, network: _this._network });
            returnType = type;
            return;
        }
        catch (ignoredErr) {
            // 何もしない
        }
    });
    if (!returnType)
        throw new Error("アドレスに誤りがあります");
    return returnType;
};
exports.default = getOutputType;
