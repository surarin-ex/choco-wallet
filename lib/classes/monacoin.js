"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ライブラリの読み込み
var bip39 = require("bip39");
var bip32 = require("bip32");
var bclib = require("bitcoinjs-lib");
// Monacoinのパラメータ設定(version prefix: Base58Checkエンコード時に頭に付加する文字列)
// Monacoin本家のソースコードと同じパラメータを使用すること (https://github.com/monacoinproject/monacoin/blob/master-0.17/src/chainparams.cpp)
var MONACOIN = {
    wif: 176,
    bip32: {
        public: 77429938,
        private: 76066276
    },
    messagePrefix: "Monacoin Signed Message:\n",
    bech32: "mona",
    pubKeyHash: 50,
    scriptHash: 55 // P
};
var pathBase = "m/49'/22'/0'";
/**
 * Monacoinのクラス
 */
var Monacoin = /** @class */ (function () {
    function Monacoin(mnemonic) {
        this._seed = bip39.mnemonicToSeed(mnemonic);
        this._node = bip32.fromSeed(this._seed, MONACOIN); // Monacoinのパラメータを指定
    }
    /**
     * おつりフラグとアドレスインデックスを指定してbip32のpathを取得する
     * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
     * @param addressIndex アドレスのインデックス 0からカウントアップしていく
     */
    Monacoin.prototype.getPath = function (changeFlag, addressIndex) {
        return pathBase + "/" + changeFlag + "/" + addressIndex;
    };
    /**
     * スタート位置のおつりフラグとアドレスインデックスを指定し、長さを指定することで、指定した長さのbip32のpath配列を取得する
     * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
     * @param addressIndex アドレスのインデックス 0からカウントアップしていく
     * @param length 長さ、10を指定するとaddressIndex〜addressIndex+9までの10要素の配列が取得できる
     */
    Monacoin.prototype.getPaths = function (changeFlag, addressIndex, length) {
        var addresses = [];
        for (var i = 0; i < length; i++) {
            addresses.push(pathBase + "/" + changeFlag + "/" + (addressIndex + i));
        }
        return addresses;
    };
    /**
     * bip32のpathを指定してアドレスを取得する
     * @param path bip32のpath
     */
    Monacoin.prototype.getAddress = function (path) {
        var child = this._node.derivePath(path);
        var address = bclib.payments.p2sh({
            redeem: bclib.payments.p2wpkh({
                pubkey: child.publicKey,
                network: MONACOIN
            })
        }).address;
        return address;
    };
    /**
     * pathの配列に対応するアドレスの配列を取得する
     * @param paths pathの配列
     */
    Monacoin.prototype.getAddresses = function (paths) {
        var _this = this;
        var addresses = paths.map(function (path) {
            return _this.getAddress(path);
        });
        return addresses;
    };
    return Monacoin;
}());
exports.default = Monacoin;
