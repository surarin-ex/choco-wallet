/**
 * BIP39のワードリストに含まれる単語かどうかを検査する関数
 * @param word 検証する単語
 * @param lang 対象の言語
 */
declare const validateBip39Word: (word: string, lang?: "EN" | "JA") => boolean;
export default validateBip39Word;
