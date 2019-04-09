import * as chai from 'chai';
import * as choco from '../../index';
import * as bip39 from 'bip39';
const assert = chai.assert;

describe('index.tsのテスト', () => {
  describe('generateMnemonic()のテスト', () => {

    it('引数を指定しない場合、英語のMnemonicが生成される', () => {
      const mnemonic = choco.generateMnemonic();
      const words = mnemonic.split(' ');
      const wordlist = bip39.wordlists['EN'];
      let result: boolean = true;
      words.forEach((word) => {
        if (wordlist.indexOf(word) === -1) {
          result = false;
          return;
        }
      })
      assert.isTrue(result);
    })

    it('引数に"JA"を指定すると、日本語のMnemonicが生成される', () => {
      const mnemonic = choco.generateMnemonic('JA');
      const words = mnemonic.split('　');
      const wordlist = bip39.wordlists['JA'];
      let result: boolean = true;
      words.forEach((word) => {
        if (wordlist.indexOf(word) === -1) {
          result = false;
          return;
        }
      })
      assert.isTrue(result);
    })
  })
})