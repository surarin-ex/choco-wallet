"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getMnemonicFromWordList_1 = require("../../../functions/getMnemonicFromWordList");
var chai_1 = require("chai");
describe("getMnemonicFromWordList() のユニットテスト", function () {
    it("正しい日本語のMnemonicのリストを与えるとMnemonicの文字列が得られる", function () {
        var wordList = [
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あいこくしん",
            "あまい",
            "ろんり"
        ];
        var mnemonic = getMnemonicFromWordList_1.default(wordList, "JA");
        chai_1.assert.deepEqual(mnemonic, "あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あまい　ろんり");
    });
    it("正しい英語のMnemonicのリストを与えるとMnemonicの文字列が得られる", function () {
        var wordList = [
            "seed",
            "sock",
            "milk",
            "update",
            "focus",
            "rotate",
            "barely",
            "fade",
            "car",
            "face",
            "mechanic",
            "mercy"
        ];
        var mnemonic = getMnemonicFromWordList_1.default(wordList, "EN");
        chai_1.assert.deepEqual(mnemonic, "seed sock milk update focus rotate barely fade car face mechanic mercy");
    });
    it("正しい日本語のMnemonicのリストをNFCの正規化形式で与えた場合でもNFKD形式のMnemonicの文字列が得られる", function () {
        var wordList = [
            "たちばな",
            "はんだん",
            "いちば",
            "めんきょ",
            "こすう",
            "しゃたい",
            "せまる",
            "いがい",
            "ひらく",
            "ほいく",
            "となえる",
            "たんそく"
        ]; // NFC形式
        var mnemonic = getMnemonicFromWordList_1.default(wordList, "JA");
        chai_1.assert.deepEqual(mnemonic, "たちばな　はんだん　いちば　めんきょ　こすう　しゃたい　せまる　いがい　ひらく　ほいく　となえる　たんそく" // NFKD形式
        );
    });
    it("11単語のMnemonicのリストの場合エラーが発生する", function () {
        try {
            var wordList = [
                "たちばな",
                "はんだん",
                "いちば",
                "めんきょ",
                "こすう",
                "しゃたい",
                "せまる",
                "いがい",
                "ひらく",
                "ほいく",
                "となえる"
            ];
            getMnemonicFromWordList_1.default(wordList, "JA");
            throw new Error("エラーが発生しませんでした");
        }
        catch (err) {
            chai_1.assert.deepEqual(err.message, "Mnemonicに誤りがあります");
        }
    });
});
