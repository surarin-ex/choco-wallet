import * as unorm from "unorm";
import * as bip39 from "bip39";

/**
 * Mnemonicの単語の配列からMnemonic文字列を生成する関数。
 * 不適切なMnemonicの場合はErrorをthrowする。
 * @param wordList Mnemonicの各ワードを配列化したもの
 * @param lang 使用する言語 "EN" or "JA"
 */
const getMnemonicFromWordList = (
  wordList: string[],
  lang: "EN" | "JA" = "EN"
): string => {
  let seperater = " ";
  if (lang === "JA") {
    seperater = "　";
  }
  const mnemonic = wordList
    .reduce((accum, word): string => {
      return `${accum}${seperater}${unorm.nfkd(word)}`;
    }, "")
    .trim();
  if (!bip39.validateMnemonic(mnemonic, bip39.wordlists[lang])) {
    throw new Error("Mnemonicに誤りがあります");
  }
  return mnemonic;
};

export default getMnemonicFromWordList;
