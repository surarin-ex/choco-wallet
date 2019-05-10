import * as bip39 from "bip39";

/**
 * Mnemonicを生成する
 * @param {string} lang 'JA', 'EN' etc...
 */
export function generateMnemonic(lang: string = "EN"): string {
  return bip39.generateMnemonic(null, null, bip39.wordlists[lang]);
}
