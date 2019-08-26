"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// BIP32のパスのベース部分を取得する関数
var pathBase = {
    Monacoin: {
        main: "m/49'/22'/0'",
        test: "m/49'/1'/0'"
    }
};
/**
 * BIP32のパスのベース部分を取得する関数
 * @param coin "Monacoin"
 * @param chain "main" or "test"
 */
var getPathBase = function (coin, chain) {
    return pathBase[coin][chain];
};
exports.default = getPathBase;
