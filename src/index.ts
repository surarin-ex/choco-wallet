import * as bip39 from "bip39";
const getRandomValues = require('get-random-values');

/**
 * Mnemonicを生成する
 * @param {string} lang 'JA', 'EN' etc...
 */
export function generateMnemonic(lang: string = "EN"): string {
  if (lang) {
    bip39.setDefaultWordlist(lang);
  }
  return bip39.generateMnemonic(null, getRandomValues);
}
