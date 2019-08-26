"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Monacoinのパラメータ設定(version prefix: Base58Checkエンコード時に頭に付加する文字列)
// Monacoin本家のソースコードと同じパラメータを使用すること (https://github.com/monacoinproject/monacoin/blob/master-0.17/src/chainparams.cpp)
var network = {
    Monacoin: {
        main: {
            wif: 176,
            bip32: {
                public: 77429938,
                private: 76066276
            },
            messagePrefix: "Monacoin Signed Message:\n",
            bech32: "mona",
            pubKeyHash: 50,
            scriptHash: 55 // P
        },
        test: {
            messagePrefix: "Monacoin Signed Message:\n",
            bip32: {
                public: 70617039,
                private: 70615956
            },
            pubKeyHash: 111,
            scriptHash: 117,
            wif: 239,
            bech32: "tmona"
        }
    }
};
var getNetwork = function (coin, chain) {
    return network[coin][chain];
};
exports.default = getNetwork;
