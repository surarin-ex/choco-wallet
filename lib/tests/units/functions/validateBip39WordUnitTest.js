"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validateBip39Word_1 = require("../../../functions/validateBip39Word");
var chai_1 = require("chai");
describe("validateBip39Word() のユニットテスト", function () {
    it("BIP39に含まれる英語の単語はtrueで返される", function () {
        var result = validateBip39Word_1.default("abandon");
        chai_1.assert.isTrue(result);
    });
    it("BIP39に含まれる日本語の単語はtrueで返される", function () {
        var result = validateBip39Word_1.default("あいこくしん", "JA");
        chai_1.assert.isTrue(result);
    });
    it("BIP39に含まれる日本語の単語は言語設定が英語の場合、falseで返される", function () {
        var result = validateBip39Word_1.default("あいこくしん", "EN");
        chai_1.assert.isFalse(result);
    });
    it("文字コードがNFKDの濁点付の単語に対してtrueで返される", function () {
        var result = validateBip39Word_1.default("あおぞら", "JA"); // この「あおぞら」は正規化形式がNFKD (BIP39で指定されている形式) https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
        chai_1.assert.isTrue(result);
    });
    it("文字コードがNFCの濁点付の単語に対してtrueで返される", function () {
        var result = validateBip39Word_1.default("あおぞら", "JA"); // この「あおぞら」は正規化形式がNFC (Windows/Linuxの標準)
        chai_1.assert.isTrue(result);
    });
});
