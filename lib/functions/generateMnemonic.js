"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require("bip39");
/**
 * Mnemonicを生成する
 * @param {string} lang 'JA', 'EN' etc...
 */
function generateMnemonic(lang) {
    if (lang === void 0) { lang = "EN"; }
    return bip39.generateMnemonic(null, null, bip39.wordlists[lang]);
}
exports.default = generateMnemonic;
