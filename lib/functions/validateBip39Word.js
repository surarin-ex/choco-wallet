"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require("bip39");
var unorm = require("unorm");
/**
 * BIP39のワードリストに含まれる単語かどうかを検査する関数
 * @param word 検証する単語
 * @param lang 対象の言語
 */
var validateBip39Word = function (word, lang) {
    if (lang === void 0) { lang = "EN"; }
    var wordlist = bip39.wordlists[lang];
    if (wordlist.indexOf(unorm.nfkd(word)) >= 0) {
        return true;
    }
    else {
        return false;
    }
};
exports.default = validateBip39Word;
