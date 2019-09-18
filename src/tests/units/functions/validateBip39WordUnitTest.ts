import validateBip39Word from "../../../functions/validateBip39Word";
import { assert } from "chai";
describe("validateBip39Word() のユニットテスト", () => {
  it("BIP39に含まれる英語の単語はtrueで返される", () => {
    const result = validateBip39Word("abandon");
    assert.isTrue(result);
  });
  it("BIP39に含まれる日本語の単語はtrueで返される", () => {
    const result = validateBip39Word("あいこくしん", "JA");
    assert.isTrue(result);
  });
  it("BIP39に含まれる日本語の単語は言語設定が英語の場合、falseで返される", () => {
    const result = validateBip39Word("あいこくしん", "EN");
    assert.isFalse(result);
  });
  it("文字コードがNFKDの濁点付の単語に対してtrueで返される", () => {
    const result = validateBip39Word("あおぞら", "JA"); // この「あおぞら」は正規化形式がNFKD (BIP39で指定されている形式) https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
    assert.isTrue(result);
  });
  it("文字コードがNFCの濁点付の単語に対してtrueで返される", () => {
    const result = validateBip39Word("あおぞら", "JA"); // この「あおぞら」は正規化形式がNFC (Windows/Linuxの標準)
    assert.isTrue(result);
  });
});
