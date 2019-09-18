import getMnemonicFromWordList from "../../../functions/getMnemonicFromWordList";
import { assert } from "chai";
describe("getMnemonicFromWordList() のユニットテスト", (): void => {
  it("正しい日本語のMnemonicのリストを与えるとMnemonicの文字列が得られる", (): void => {
    const wordList = [
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あいこくしん",
      "あまい",
      "ろんり"
    ];
    const mnemonic = getMnemonicFromWordList(wordList, "JA");
    assert.deepEqual(
      mnemonic,
      "あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あいこくしん　あまい　ろんり"
    );
  });
  it("正しい英語のMnemonicのリストを与えるとMnemonicの文字列が得られる", (): void => {
    const wordList = [
      "seed",
      "sock",
      "milk",
      "update",
      "focus",
      "rotate",
      "barely",
      "fade",
      "car",
      "face",
      "mechanic",
      "mercy"
    ];
    const mnemonic = getMnemonicFromWordList(wordList, "EN");
    assert.deepEqual(
      mnemonic,
      "seed sock milk update focus rotate barely fade car face mechanic mercy"
    );
  });
  it("正しい日本語のMnemonicのリストをNFCの正規化形式で与えた場合でもNFKD形式のMnemonicの文字列が得られる", (): void => {
    const wordList = [
      "たちばな",
      "はんだん",
      "いちば",
      "めんきょ",
      "こすう",
      "しゃたい",
      "せまる",
      "いがい",
      "ひらく",
      "ほいく",
      "となえる",
      "たんそく"
    ]; // NFC形式
    const mnemonic = getMnemonicFromWordList(wordList, "JA");
    assert.deepEqual(
      mnemonic,
      "たちばな　はんだん　いちば　めんきょ　こすう　しゃたい　せまる　いがい　ひらく　ほいく　となえる　たんそく" // NFKD形式
    );
  });
  it("11単語のMnemonicのリストの場合エラーが発生する", (): void => {
    try {
      const wordList = [
        "たちばな",
        "はんだん",
        "いちば",
        "めんきょ",
        "こすう",
        "しゃたい",
        "せまる",
        "いがい",
        "ひらく",
        "ほいく",
        "となえる"
      ];
      getMnemonicFromWordList(wordList, "JA");
      throw new Error("エラーが発生しませんでした");
    } catch (err) {
      assert.deepEqual(err.message, "Mnemonicに誤りがあります");
    }
  });
});
