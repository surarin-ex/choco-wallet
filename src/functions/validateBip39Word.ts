import * as bip39 from "bip39";
import * as unorm from "unorm";

/**
 * BIP39のワードリストに含まれる単語かどうかを検査する関数
 * @param word 検証する単語
 * @param lang 対象の言語
 */
const validateBip39Word = (word: string, lang: "EN" | "JA" = "EN"): boolean => {
  const wordlist = bip39.wordlists[lang];
  if (wordlist.indexOf(unorm.nfkd(word)) >= 0) {
    return true;
  } else {
    return false;
  }
};

export default validateBip39Word;
