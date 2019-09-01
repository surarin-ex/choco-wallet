"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var estimateTxBytes_1 = require("../functions/estimateTxBytes");
var getNetwork_1 = require("../functions/getNetwork");
var getPathBase_1 = require("../functions/getPathBase");
var getOutputType_1 = require("../functions/getOutputType");
/**
 * Monacoinのクラス
 */
var Monacoin = /** @class */ (function () {
    function Monacoin(mnemonic, chain) {
        if (chain === void 0) { chain = "main"; }
        this.blockbook = null;
        this.addressInfos = [];
        this.balance = "0";
        this.displayUnit = "MONA";
        this.balanceUnit = "WATANABE";
        this.addressType = "P2SH-P2WPKH";
        this.minFeeRate = 150; // watanabe / byte
        this._chain = chain;
        this._coin = "Monacoin";
        this.digit = 100000000;
        this.gapLimitReceiving = 10; // 未使用受取アドレスの余裕数
        this.gapLimitChange = 3; // 未使用おつりアドレスの余裕数
        this._network = getNetwork_1.default(this._coin, this._chain);
        this._pathBase = getPathBase_1.default(this._coin, this._chain);
        this._seed = bip39.mnemonicToSeed(mnemonic);
        this._node = bip32.fromSeed(this._seed, this._network); // Monacoinのパラメータを指定
        this.unsignedTx = null;
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
     * bip32のpathを指定してTXの作成に使用可能なPaymentオブジェクトを取得する
     * @param path bip32のpath
     */
    Monacoin.prototype._getPaymentFromPath = function (path) {
        var child = this._node.derivePath(path);
        var address;
        if (this.addressType === "P2SH-P2WPKH") {
            address = bclib.payments.p2sh({
                redeem: bclib.payments.p2wpkh({
                    pubkey: child.publicKey,
                    network: this._network
                })
            });
        }
        else {
            throw new Error(this.addressType + " is not defined.");
        }
        return address;
    };
    /**
     * bip32のpathを指定してアドレスを取得する
     * @param path bip32のpath
     */
    Monacoin.prototype.getAddress = function (path) {
        var address = this._getPaymentFromPath(path).address;
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
                        return [4 /*yield*/, this.blockbook.getBlockbookAddresses(addresses)];
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
     * プロパティのアドレス情報の配列から、承認済み残高と未承認残高の合計値を計算して文字列形式で出力するメソッド。
     * updateAddressInfos()が未実行の場合"0"を返す
     */
    Monacoin.prototype._updateBalance = function () {
        var balance = this.addressInfos.reduce(function (sum, info) {
            var sumNum = new bignumber_js_1.default(sum)
                .plus(info.balance)
                .plus(info.unconfirmedBalance);
            return sumNum.toString();
        }, "0");
        this.balance = balance;
        this.balanceReadable = new bignumber_js_1.default(balance)
            .dividedBy(this.digit)
            .toString();
    };
    /**
     * 受取用アドレスにおつりフラグが立っておらず、未使用のアドレスをセットする。
     * ※addressInfosプロパティがindexの小さい順に並んでいることを前提としている
     */
    Monacoin.prototype._setReceiveAddress = function () {
        var receiveAddressInfo = this.addressInfos.find(function (info) {
            return !info.isChange && !info.isSpent;
        });
        this.receiveAddress = receiveAddressInfo.address;
    };
    /**
     * おつり用アドレスにおつりフラグが立っていて、未使用のアドレスをセットする。
     * ※addressInfosプロパティがindexの小さい順に並んでいることを前提としている
     */
    Monacoin.prototype._setChangeAddress = function () {
        var changeAddressInfo = this.addressInfos.find(function (info) {
            return info.isChange && !info.isSpent;
        });
        this.changeAddress = changeAddressInfo.address;
    };
    /**
     * GAP_LIMITまでの全アドレス情報を取得するメソッド。
     * 取得したアドレス情報はインスタンスのプロパティに格納され、返り値としても渡される
     * @type {object} options 引数のオブジェクト
     * @property {number} receivingAddressNum 最低限取得する受取アドレスの個数
     * @property {number} changeAddressNum 最低限取得するおつりアドレスの個数
     * @param options 引数のオブジェクト
     */
    Monacoin.prototype.updateAddressInfos = function (options) {
        if (options === void 0) { options = {
            receivingAddressNum: this.gapLimitReceiving,
            changeAddressNum: this.gapLimitChange
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, allAddressData, unspentSequence, nextIndex, length_1, length_2, addressInfos;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, blockbook_1.default(this._chain, this._coin)];
                    case 1:
                        _a.blockbook = _f.sent();
                        allAddressData = {
                            allPaths: [],
                            allBlockbookAddresses: []
                        };
                        return [4 /*yield*/, this._getAddressData({
                                allAddressData: allAddressData,
                                isChange: 0,
                                startIndex: 0,
                                length: options.receivingAddressNum,
                                startSequence: 0
                            })];
                    case 2:
                        (_b = _f.sent(), allAddressData = _b.allAddressData, unspentSequence = _b.unspentSequence);
                        nextIndex = options.receivingAddressNum;
                        _f.label = 3;
                    case 3:
                        if (!(unspentSequence < this.gapLimitReceiving)) return [3 /*break*/, 5];
                        length_1 = Math.max(this.gapLimitReceiving - unspentSequence, 0);
                        return [4 /*yield*/, this._getAddressData({
                                allAddressData: allAddressData,
                                isChange: 0,
                                startIndex: nextIndex,
                                length: length_1,
                                startSequence: unspentSequence
                            })];
                    case 4:
                        (_c = _f.sent(), allAddressData = _c.allAddressData, unspentSequence = _c.unspentSequence);
                        nextIndex += length_1;
                        return [3 /*break*/, 3];
                    case 5: return [4 /*yield*/, this._getAddressData({
                            allAddressData: allAddressData,
                            isChange: 1,
                            startIndex: 0,
                            length: options.changeAddressNum,
                            startSequence: 0
                        })];
                    case 6:
                        // おつりアドレスの情報取得
                        (_d = _f.sent(), allAddressData = _d.allAddressData, unspentSequence = _d.unspentSequence);
                        nextIndex = options.changeAddressNum;
                        _f.label = 7;
                    case 7:
                        if (!(unspentSequence < this.gapLimitChange)) return [3 /*break*/, 9];
                        length_2 = Math.max(this.gapLimitChange - unspentSequence, 0);
                        return [4 /*yield*/, this._getAddressData({
                                allAddressData: allAddressData,
                                isChange: 1,
                                startIndex: nextIndex,
                                length: length_2,
                                startSequence: unspentSequence
                            })];
                    case 8:
                        (_e = _f.sent(), allAddressData = _e.allAddressData, unspentSequence = _e.unspentSequence);
                        nextIndex += length_2;
                        return [3 /*break*/, 7];
                    case 9:
                        addressInfos = [];
                        allAddressData.allBlockbookAddresses.forEach(function (info, index) {
                            addressInfos.push({
                                address: info.address,
                                path: allAddressData.allPaths[index],
                                isSpent: info.totalReceived !== "0" ? true : false,
                                isChange: allAddressData.allPaths[index].split("/")[4] === "1" ? true : false,
                                index: parseInt(allAddressData.allPaths[index].split("/")[5]),
                                balance: info.balance,
                                unconfirmedBalance: info.unconfirmedBalance,
                                txids: info.txids
                            });
                        });
                        this.addressInfos = addressInfos;
                        this._updateBalance();
                        this._setReceiveAddress();
                        this._setChangeAddress();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * トランザクション情報をBlockbookから取得して、プロパティのtxInfosを更新するメソッド
     */
    Monacoin.prototype.updateTxInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dupTxids, txids, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.addressInfos.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateAddressInfos()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        dupTxids = [];
                        this.addressInfos.forEach(function (info) {
                            if (info.txids) {
                                dupTxids = dupTxids.concat(info.txids);
                            }
                        });
                        txids = dupTxids.filter(function (address, index, addresses) {
                            return addresses.indexOf(address) === index;
                        });
                        _a = this;
                        return [4 /*yield*/, this.blockbook.getBlockbookTxs(txids)];
                    case 3:
                        _a.txInfos = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 妥当な手数料率を数値文字列で取得する。単位は watanabe / byte。
     * 最低の手数料率は 150 watanabe / byte。
     * @param speed ブロックに取り込まれるまでの速さの指定
     */
    Monacoin.prototype.estimateFeeRate = function (speed) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, numberOfBlocks, feeRate_MONA_kB, feeRate_WATANABE_B, feeRate;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.blockbook) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, blockbook_1.default(this._chain, this._coin)];
                    case 1:
                        _a.blockbook = _b.sent();
                        _b.label = 2;
                    case 2:
                        switch (speed) {
                            case "fast":
                                numberOfBlocks = 2;
                                break;
                            case "normal":
                                numberOfBlocks = 5;
                                break;
                            case "slow":
                                numberOfBlocks = 20;
                                break;
                            case "min":
                                return [2 /*return*/, this.minFeeRate];
                            default:
                                numberOfBlocks = 2;
                        }
                        return [4 /*yield*/, this.blockbook.estimateBlockbookFeeRate(numberOfBlocks)];
                    case 3:
                        feeRate_MONA_kB = _b.sent();
                        feeRate_WATANABE_B = new bignumber_js_1.default(feeRate_MONA_kB).times(100000);
                        feeRate = feeRate_WATANABE_B.gt(this.minFeeRate)
                            ? feeRate_WATANABE_B.toNumber()
                            : this.minFeeRate;
                        return [2 /*return*/, feeRate];
                }
            });
        });
    };
    /**
     * UTXOを取得するメソッド。
     * txInfosが未取得の場合は空配列を返す。
     * 返り値はkey-valueオブジェクトの配列で、keyは"txid:vout"、valueはwatanabe単位の金額の数値文字列
     */
    Monacoin.prototype._getUtxos = function () {
        var _this = this;
        var spentOutputs = [];
        this.txInfos.forEach(function (txInfo) {
            txInfo.vin.forEach(function (input) {
                spentOutputs.push(input.txid + ":" + (input.vout || 0));
            });
        });
        var utxos = []; // key: "txid:vout", value: value
        this.txInfos.sort(function (a, b) {
            return b.confirmations - a.confirmations;
        });
        this.txInfos.forEach(function (txInfo) {
            txInfo.vout.forEach(function (output) {
                if (spentOutputs.indexOf(txInfo.txid + ":" + output.n) < 0) {
                    var info = _this.addressInfos.find(function (info) {
                        return info.address === output.addresses[0];
                    });
                    if (info) {
                        var tx = bclib.Transaction.fromHex(txInfo.hex);
                        utxos.push({
                            txid: txInfo.txid,
                            index: output.n,
                            amount: output.value,
                            script: tx.outs[output.n].script.toString("hex"),
                            txHex: txInfo.hex,
                            path: info.path,
                            confirmations: txInfo.confirmations
                        });
                    }
                }
            });
        });
        return utxos;
    };
    /**
     * UTXOをbitcoinjs-libのWitnessUtxoの型に変換するメソッド
     * @param utxo Utxoオブジェクト
     */
    Monacoin.prototype._getWitnessUtxo = function (utxo) {
        var witnessUtxo = {
            value: parseInt(utxo.amount),
            script: Buffer.from(utxo.script, "hex")
        };
        return witnessUtxo;
    };
    /**
     * bitcoinjs-libのPaymentに追加するためのInputDataを作成するメソッド
     * @param utxo Utxoオブジェクト
     * @param payment bitcoinjs-libのPaymentオブジェクト
     * @param isSegwit Segwitか否かを表すフラグ
     * @param redeemType redeemscriptのタイプ "p2sh" "p2wsh" "p2sh-p2wsh"
     */
    Monacoin.prototype._getInputData = function (utxo, payment, isSegwit, redeemType) {
        var nonWitnessUtxo = Buffer.from(utxo.txHex, "hex");
        var witnessUtxo = this._getWitnessUtxo(utxo);
        var mixin = isSegwit ? { witnessUtxo: witnessUtxo } : { nonWitnessUtxo: nonWitnessUtxo };
        var mixin2 = {};
        switch (redeemType) {
            case "p2sh":
                mixin2.redeemScript = payment.redeem.output;
                break;
            case "p2wsh":
                mixin2.witnessScript = payment.redeem.output;
                break;
            case "p2sh-p2wsh":
                mixin2.witnessScript = payment.redeem.redeem.output;
                mixin2.redeemScript = payment.redeem.output;
                break;
        }
        return __assign(__assign({ hash: Buffer.from(Uint8Array.from(Buffer.from(utxo.txid, "hex")).reverse()), index: utxo.index }, mixin), mixin2);
    };
    /**
     * PSBTに追加するためのoutputデータを作成するメソッド
     * @param toAddress 送金先のアドレス
     * @param amount 金額 watanabe単位
     */
    Monacoin.prototype._getOutputData = function (toAddress, amount) {
        var type = getOutputType_1.default(toAddress, this._network);
        var payment = bclib.payments[type]({
            address: toAddress,
            network: this._network
        });
        return {
            script: payment.output,
            value: amount
        };
    };
    /**
     * トランザクションの生成に必要なUTXOを選択するとともに、手数料を推定するメソッド
     * @param options 引数オブジェクト
     */
    Monacoin.prototype._selectUtxos = function (options) {
        var amount = new bignumber_js_1.default(options.amount);
        var utxos = [];
        var sumInput = new bignumber_js_1.default(0);
        var estimateFees = new bignumber_js_1.default(0);
        var inputs = { P2PKH: 0, P2WPKH: 0, "P2SH-P2WPKH": 0 };
        var outputs = { P2SH: 0, P2PKH: 0, P2WPKH: 0, P2WSH: 0 };
        var outputType = getOutputType_1.default(options.toAddress, this._network).toUpperCase();
        outputs[outputType]++;
        var changeType = this.addressType.slice(0, 4) === "P2SH" ? "P2SH" : this.addressType;
        var hasChange = false;
        for (var _i = 0, _a = options.utxos; _i < _a.length; _i++) {
            var utxo = _a[_i];
            utxos.push(utxo);
            sumInput = sumInput.plus(utxo.amount);
            inputs[this.addressType]++;
            // おつりアドレスなしでfeeを計算
            estimateFees = new bignumber_js_1.default(estimateTxBytes_1.default(inputs, outputs)).times(options.feeRate);
            if (sumInput.eq(amount.plus(estimateFees))) {
                hasChange = false;
                break;
            }
            // おつりアドレスを追加してfeeを再計算
            outputs[changeType]++; // おつりアドレスを追加
            estimateFees = new bignumber_js_1.default(estimateTxBytes_1.default(inputs, outputs)).times(options.feeRate);
            if (sumInput.gte(amount.plus(estimateFees))) {
                hasChange = true;
                break;
            }
            outputs[changeType]--; // おつりアドレスを除外
        }
        if (sumInput.lt(amount.plus(estimateFees)))
            throw new Error("残高不足です");
        return {
            utxos: utxos,
            estimateFees: estimateFees.toString(),
            sumInput: sumInput.toString(),
            hasChange: hasChange
        };
    };
    /**
     * 未署名トランザクションを生成し、プロパティのunsignedTxにセットするメソッド
     * @param options 引数オブジェクト
     */
    Monacoin.prototype.updateUnsignedTx = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var amount_big, allUtxos, _a, utxos, estimateFees, sumInput, hasChange, psbt, inputDataList, outputDataList, outputData1, changeAmount, outputData2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        amount_big = new bignumber_js_1.default(options.amount);
                        if (amount_big.lte(0) ||
                            !Number.isInteger(amount_big.toNumber()) ||
                            amount_big.toString() === "NaN") {
                            throw new Error("送金額が不適切です");
                        }
                        if (options.feeRate < this.minFeeRate ||
                            !Number.isInteger(options.feeRate)) {
                            throw new Error("手数料のレートが不適切です");
                        }
                        if (!!this.addressInfos) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateAddressInfos()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!!this.txInfos) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateTxInfos()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        allUtxos = this._getUtxos();
                        _a = this._selectUtxos({
                            utxos: allUtxos,
                            feeRate: options.feeRate,
                            toAddress: options.toAddress,
                            amount: options.amount
                        }), utxos = _a.utxos, estimateFees = _a.estimateFees, sumInput = _a.sumInput, hasChange = _a.hasChange;
                        psbt = new bclib.Psbt({ network: this._network });
                        psbt.setVersion(2);
                        psbt.setLocktime(0);
                        inputDataList = [];
                        utxos.forEach(function (utxo) {
                            var payment = _this._getPaymentFromPath(utxo.path);
                            var inputData = _this._getInputData(utxo, payment, true, "p2sh");
                            inputDataList.push(inputData);
                        });
                        psbt.addInputs(inputDataList);
                        outputDataList = [];
                        outputData1 = this._getOutputData(options.toAddress, parseInt(options.amount));
                        outputDataList.push(outputData1);
                        if (hasChange) {
                            changeAmount = new bignumber_js_1.default(sumInput)
                                .minus(new bignumber_js_1.default(options.amount))
                                .minus(new bignumber_js_1.default(estimateFees));
                            outputData2 = this._getOutputData(this.changeAddress, changeAmount.toNumber());
                            outputDataList.push(outputData2);
                        }
                        psbt.addOutputs(outputDataList);
                        this.unsignedTx = {
                            psbt: psbt,
                            utxos: utxos,
                            amount: options.amount,
                            fees: estimateFees,
                            feeRate: options.feeRate,
                            sumInput: sumInput,
                            toAddress: options.toAddress
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 未署名トランザクションの概要を取得するメソッド
     */
    Monacoin.prototype.getUnsignedTxSummary = function () {
        return {
            amount: this.unsignedTx.amount,
            amount_mona: new bignumber_js_1.default(this.unsignedTx.amount)
                .dividedBy(this.digit)
                .toString(),
            fees: this.unsignedTx.fees,
            fees_mona: new bignumber_js_1.default(this.unsignedTx.fees)
                .dividedBy(this.digit)
                .toString(),
            sumInput: this.unsignedTx.sumInput,
            sumInput_mona: new bignumber_js_1.default(this.unsignedTx.sumInput)
                .dividedBy(this.digit)
                .toString(),
            feeRate: this.unsignedTx.feeRate,
            inputCount: this.unsignedTx.psbt.inputCount,
            toAddress: this.unsignedTx.toAddress
        };
    };
    /**
     * 未署名トランザクションに署名するメソッド
     */
    Monacoin.prototype.signTx = function () {
        var _this = this;
        try {
            // 署名
            this.unsignedTx.utxos.forEach(function (utxo, index) {
                _this.unsignedTx.psbt.signInput(index, _this._node.derivePath(utxo.path));
            });
            // 署名の検証
            this.unsignedTx.utxos.forEach(function (utxo, index) {
                var result = _this.unsignedTx.psbt.validateSignaturesOfInput(index);
                if (!result)
                    throw new Error("トランザクションの署名の検証でエラーが発生しました");
            });
            this.unsignedTx.psbt.finalizeAllInputs();
            this.signedTx = this.unsignedTx;
            this.unsignedTx = null;
        }
        catch (err) {
            throw err;
        }
    };
    /**
     * 署名済みトランザクションの概要を取得する
     */
    Monacoin.prototype.getSignedTxSummary = function () {
        var _this = this;
        var tx = this.signedTx.psbt.extractTransaction();
        var txHex = tx.toHex();
        var outs = tx.outs.map(function (out) {
            return {
                address: bclib.address.fromOutputScript(out.script, _this._network),
                amount: "value" in out ? out.value.toString() : "unknown",
                amount_mona: "value" in out
                    ? new bignumber_js_1.default(out.value).dividedBy(_this.digit).toString()
                    : "unknown"
            };
        });
        var outsExceptChange = outs.filter(function (out) {
            return out.address !== _this.changeAddress;
        });
        var change = outs.find(function (out) {
            return out.address === _this.changeAddress;
        }) || null;
        var amount = outsExceptChange.reduce(function (sum, out) {
            return new bignumber_js_1.default(sum).plus(new bignumber_js_1.default(out.amount)).toString();
        }, "0");
        var amount_mona = new bignumber_js_1.default(amount).dividedBy(this.digit).toString();
        return {
            txid: tx.getId(),
            byteLength: tx.byteLength(),
            vsize: tx.virtualSize(),
            weight: tx.weight(),
            amount: amount,
            amount_mona: amount_mona,
            fees: this.signedTx.fees,
            fees_mona: new bignumber_js_1.default(this.signedTx.fees)
                .dividedBy(this.digit)
                .toString(),
            confirmedFeeRate: this.signedTx.psbt.getFeeRate(),
            configuredFeeRate: this.signedTx.feeRate,
            outs: outsExceptChange,
            change: change,
            txHex: txHex
        };
    };
    /**
     * 署名済みトランザクションをnullにセットする
     */
    Monacoin.prototype.deleteSignedTx = function () {
        this.signedTx = null;
    };
    /**
     * 署名済みのトランザクションブロードキャストするメソッド。
     * ブロードキャストに成功した場合txidを返し、署名済みトランザクションを破棄する
     */
    Monacoin.prototype.broadcastTx = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signedTx)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.blockbook.broadcastTx(this.signedTx.psbt.extractTransaction().toHex())];
                    case 1:
                        result = _a.sent();
                        this.deleteSignedTx();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Monacoin;
}());
exports.default = Monacoin;
