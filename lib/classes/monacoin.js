"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// ライブラリの読み込み
var bip39 = require("bip39");
var bip32 = require("bip32");
var bclib = require("bitcoinjs-lib");
var blockbook_1 = require("./blockbook");
var bignumber_js_1 = require("bignumber.js");
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
// Monacoin-Testnetのパラメータ設定
var MONACOIN_TESTNET = {
    messagePrefix: "Monacoin Signed Message:\n",
    bip32: {
        public: 70617039,
        private: 70615956
    },
    pubKeyHash: 111,
    scriptHash: 117,
    wif: 239,
    bech32: "tmona"
};
var pathBase = "m/49'/22'/0'";
var pathBase_test = "m/49'/1'/0'";
var GAP_LIMIT_RECEIVING = 10; // 未使用受取アドレスの余裕数
var GAP_LIMIT_CHANGE = 3; // 未使用おつりアドレスの余裕数
/**
 * Monacoinのクラス
 */
var Monacoin = /** @class */ (function () {
    function Monacoin(mnemonic, chain) {
        if (chain === void 0) { chain = "main"; }
        this.addressInfos = [];
        this._seed = bip39.mnemonicToSeed(mnemonic);
        this._node = bip32.fromSeed(this._seed, MONACOIN); // Monacoinのパラメータを指定
        this._chain = chain;
        this._coin = "Monacoin";
        this._network = chain === "main" ? MONACOIN : MONACOIN_TESTNET;
        this._pathBase = chain === "main" ? pathBase : pathBase_test;
    }
    /**
     * おつりフラグとアドレスインデックスを指定してbip32のpathを取得する
     * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
     * @param addressIndex アドレスのインデックス 0からカウントアップしていく
     */
    Monacoin.prototype.getPath = function (changeFlag, addressIndex) {
        return this._pathBase + "/" + changeFlag + "/" + addressIndex;
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
            addresses.push(this._pathBase + "/" + changeFlag + "/" + (addressIndex + i));
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
                network: this._network
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
    /**
     * 未使用アドレス連続数を取得するメソッド
     * @param addressInfos アドレス情報の配列
     * @param startSequence 未使用アドレス連続数の初期値
     */
    Monacoin.prototype._getUnspentAddressSequence = function (addressInfos, startSequence) {
        var unspentSequence = startSequence;
        addressInfos.forEach(function (info) {
            unspentSequence++;
            if (info.txs > 0)
                unspentSequence = 0;
        });
        return unspentSequence;
    };
    /**
     * アドレスの種類・個数を指定して、パスとアドレス情報を取得し、返り値としてそれらを詰め込んだオブジェクトと未使用アドレスの連続数を出力するメソッド。
     * gap limit を補償するために使用する未使用アドレスの連続数を計算して返り値として返す。
     * @type {object} allAddressData - アドレス情報とそのパスをまとめたオブジェクト
     * @property {string[]} allPaths パスの配列
     * @property {BlockbookAddress[]} allBlockbookAddresses blockbookから取得するアドレス情報の格納先
     * @type {object} options 引数のオブジェクト
     * @property {object} blockbook Blockbookオブジェクト
     * @property {object} allAddressData アドレス情報とパスをまとめたオブジェクト
     * @property {0 | 1} isChange おつりフラグ
     * @property {number} startIndex 取得するアドレスの最初のインデックス
     * @property {number} length 取得するアドレスの個数
     * @property {number} startSequence 未使用アドレスの連続数の初期値
     * @return {object} 全アドレス情報と未使用アドレスの連続数
     * @property {object} allAddressData 元のアドレス情報と取得した全アドレス情報をマージしたオブジェクト
     * @property {number} unspentSequence 未使用アドレスの連続数
     */
    Monacoin.prototype._getAddressData = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var allAddressData_1, paths, addresses, addressInfos, unspentSequence, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        allAddressData_1 = Object.assign({}, options.allAddressData);
                        paths = this.getPaths(options.isChange, options.startIndex, options.length);
                        addresses = this.getAddresses(paths);
                        return [4 /*yield*/, options.blockbook.getBlockbookAddresses(addresses)];
                    case 1:
                        addressInfos = _a.sent();
                        unspentSequence = this._getUnspentAddressSequence(addressInfos, options.startSequence);
                        paths.forEach(function (path) {
                            allAddressData_1.allPaths.push(path);
                        });
                        addressInfos.forEach(function (info) {
                            allAddressData_1.allBlockbookAddresses.push(info);
                        });
                        return [2 /*return*/, { allAddressData: allAddressData_1, unspentSequence: unspentSequence }];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GAP_LIMITまでの全アドレス情報を取得するメソッド。
     * 取得したアドレス情報はインスタンスのプロパティに格納され、返り値としても渡される
     * @type {object} options 引数のオブジェクト
     * @property {number} receivingAddressNum 最低限取得する受取アドレスの個数
     * @property {number} changeAddressNum 最低限取得するおつりアドレスの個数
     * @param options 引数のオブジェクト
     */
    Monacoin.prototype.getAllAddressInfos = function (options) {
        if (options === void 0) { options = {
            receivingAddressNum: GAP_LIMIT_RECEIVING,
            changeAddressNum: GAP_LIMIT_CHANGE
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, blockbook, allAddressData, unspentSequence, nextIndex, length_1, length_2, addressInfos;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default(this._chain, this._coin)];
                    case 1:
                        blockbook = _e.sent();
                        allAddressData = {
                            allPaths: [],
                            allBlockbookAddresses: []
                        };
                        return [4 /*yield*/, this._getAddressData({
                                blockbook: blockbook,
                                allAddressData: allAddressData,
                                isChange: 0,
                                startIndex: 0,
                                length: options.receivingAddressNum,
                                startSequence: 0
                            })];
                    case 2:
                        (_a = _e.sent(), allAddressData = _a.allAddressData, unspentSequence = _a.unspentSequence);
                        nextIndex = options.receivingAddressNum;
                        _e.label = 3;
                    case 3:
                        if (!(unspentSequence < GAP_LIMIT_RECEIVING)) return [3 /*break*/, 5];
                        length_1 = Math.max(GAP_LIMIT_RECEIVING - unspentSequence, 0);
                        return [4 /*yield*/, this._getAddressData({
                                blockbook: blockbook,
                                allAddressData: allAddressData,
                                isChange: 0,
                                startIndex: nextIndex,
                                length: length_1,
                                startSequence: unspentSequence
                            })];
                    case 4:
                        (_b = _e.sent(), allAddressData = _b.allAddressData, unspentSequence = _b.unspentSequence);
                        nextIndex += length_1;
                        return [3 /*break*/, 3];
                    case 5: return [4 /*yield*/, this._getAddressData({
                            blockbook: blockbook,
                            allAddressData: allAddressData,
                            isChange: 1,
                            startIndex: 0,
                            length: options.changeAddressNum,
                            startSequence: 0
                        })];
                    case 6:
                        // おつりアドレスの情報取得
                        (_c = _e.sent(), allAddressData = _c.allAddressData, unspentSequence = _c.unspentSequence);
                        nextIndex = options.changeAddressNum;
                        _e.label = 7;
                    case 7:
                        if (!(unspentSequence < GAP_LIMIT_CHANGE)) return [3 /*break*/, 9];
                        length_2 = Math.max(GAP_LIMIT_CHANGE - unspentSequence, 0);
                        return [4 /*yield*/, this._getAddressData({
                                blockbook: blockbook,
                                allAddressData: allAddressData,
                                isChange: 1,
                                startIndex: nextIndex,
                                length: length_2,
                                startSequence: unspentSequence
                            })];
                    case 8:
                        (_d = _e.sent(), allAddressData = _d.allAddressData, unspentSequence = _d.unspentSequence);
                        nextIndex += length_2;
                        return [3 /*break*/, 7];
                    case 9:
                        addressInfos = [];
                        allAddressData.allBlockbookAddresses.forEach(function (info, index) {
                            addressInfos.push({
                                address: info.address,
                                path: allAddressData.allPaths[index],
                                isSpent: info.txs > 0 ? true : false,
                                isChange: allAddressData.allPaths[index].split("/")[4] === "1" ? true : false,
                                index: parseInt(allAddressData.allPaths[index].split("/")[5]),
                                balance: info.balance,
                                unconfirmedBalance: info.unconfirmedBalance,
                                txids: info.txids
                            });
                        });
                        this.addressInfos = addressInfos;
                        return [2 /*return*/, addressInfos];
                }
            });
        });
    };
    /**
     * プロパティのアドレス情報の配列から、承認済み残高と未承認残高の合計値を計算して文字列形式で出力するメソッド。
     * getAllAddressInfos()が未実行の場合"0"を返す
     */
    Monacoin.prototype.getBalance = function () {
        var balance = this.addressInfos.reduce(function (sum, info) {
            var sumNum = new bignumber_js_1.default(sum)
                .plus(info.balance)
                .plus(info.unconfirmedBalance);
            return sumNum.toString();
        }, "0");
        return balance;
    };
    return Monacoin;
}());
exports.default = Monacoin;
