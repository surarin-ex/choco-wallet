import * as bip39 from "bip39";

/**
 * Mnemonicを生成する
 * @param {string} lang 'JA', 'EN' etc...
 */
export function generateMnemonic(lang: string = "EN"): string {
  if (lang) {
    bip39.setDefaultWordlist(lang);
  }
  return bip39.generateMnemonic();
}
