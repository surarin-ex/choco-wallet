import * as chai from "chai";
import generateMnemonic from "../../../functions/generateMnemonic";
import * as bip39 from "bip39";
const assert = chai.assert;

describe("generateMnemonic.tsのテスト", (): void => {
  describe("generateMnemonic()のテスト", (): void => {
    it("引数を指定しない場合、英語のMnemonicが生成される", (): void => {
      const mnemonic = generateMnemonic();
      const words = mnemonic.split(" ");
      const wordlist = bip39.wordlists["EN"];
      let result = true;
      words.forEach((word): void => {
        if (wordlist.indexOf(word) === -1) {
          result = false;
          return;
        }
      });
      assert.isTrue(result);
    });

    it('引数に"JA"を指定すると、日本語のMnemonicが生成される', (): void => {
      const mnemonic = generateMnemonic("JA");
      const words = mnemonic.split("　");
      const wordlist = bip39.wordlists["JA"];
      let result = true;
      words.forEach((word): void => {
        if (wordlist.indexOf(word) === -1) {
          result = false;
          return;
        }
      });
      assert.isTrue(result);
    });
  });
});
