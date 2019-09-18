"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unorm = require("unorm");
var bip39 = require("bip39");
/**
 * Mnemonicの単語の配列からMnemonic文字列を生成する関数。
 * 不適切なMnemonicの場合はErrorをthrowする。
 * @param wordList Mnemonicの各ワードを配列化したもの
 * @param lang 使用する言語 "EN" or "JA"
 */
var getMnemonicFromWordList = function (wordList, lang) {
    if (lang === void 0) { lang = "EN"; }
    var seperater = " ";
    if (lang === "JA") {
        seperater = "　";
    }
    var mnemonic = wordList
        .reduce(function (accum, word) {
        return "" + accum + seperater + unorm.nfkd(word);
    }, "")
        .trim();
    if (!bip39.validateMnemonic(mnemonic, bip39.wordlists[lang])) {
        throw new Error("Mnemonicに誤りがあります");
    }
    return mnemonic;
};
exports.default = getMnemonicFromWordList;
