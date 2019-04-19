"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var choco = require("../../index");
var bip39 = require("bip39");
var assert = chai.assert;
describe("index.tsのテスト", function () {
    describe("generateMnemonic()のテスト", function () {
        it("引数を指定しない場合、英語のMnemonicが生成される", function () {
            var mnemonic = choco.generateMnemonic();
            var words = mnemonic.split(" ");
            var wordlist = bip39.wordlists["EN"];
            var result = true;
            words.forEach(function (word) {
                if (wordlist.indexOf(word) === -1) {
                    result = false;
                    return;
                }
            });
            assert.isTrue(result);
        });
        it('引数に"JA"を指定すると、日本語のMnemonicが生成される', function () {
            var mnemonic = choco.generateMnemonic("JA");
            var words = mnemonic.split("　");
            var wordlist = bip39.wordlists["JA"];
            var result = true;
            words.forEach(function (word) {
                if (wordlist.indexOf(word) === -1) {
                    result = false;
                    return;
                }
            });
            assert.isTrue(result);
        });
    });
});
