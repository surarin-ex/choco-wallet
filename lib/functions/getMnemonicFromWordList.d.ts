/**
 * Mnemonicの単語の配列からMnemonic文字列を生成する関数。
 * 不適切なMnemonicの場合はErrorをthrowする。
 * @param wordList Mnemonicの各ワードを配列化したもの
 * @param lang 使用する言語 "EN" or "JA"
 */
declare const getMnemonicFromWordList: (wordList: string[], lang?: "EN" | "JA") => string;
export default getMnemonicFromWordList;
