"use strict";
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
var monacoin_1 = require("../../../classes/monacoin");
var chai_1 = require("chai");
var bignumber_js_1 = require("bignumber.js");
var estimateTxBytes_1 = require("../../../functions/estimateTxBytes");
var bclib = require("bitcoinjs-lib");
var sleep = function (miliSec) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, miliSec);
    });
};
describe("Monacoin のユニットテスト", function () {
    describe("getPath() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん");
        });
        it("おつりフラグ0、アドレスインデックス0で適切な値を取得できる", function () {
            var path = monacoin.getPath(0, 0);
            chai_1.assert.deepEqual(path, "m/49'/22'/0'/0/0");
        });
        it("おつりフラグ1、アドレスインデックス100で適切な値を取得できる", function () {
            var path = monacoin.getPath(1, 100);
            chai_1.assert.deepEqual(path, "m/49'/22'/0'/1/100");
        });
    });
    describe("getPaths() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん");
        });
        it("おつりフラグ0、アドレスインデックス0、長さ3で適切な値を取得できる", function () {
            var paths = monacoin.getPaths(0, 0, 3);
            chai_1.assert.deepEqual(paths[0], "m/49'/22'/0'/0/0");
            chai_1.assert.deepEqual(paths[1], "m/49'/22'/0'/0/1");
            chai_1.assert.deepEqual(paths[2], "m/49'/22'/0'/0/2");
        });
        it("おつりフラグ1、アドレスインデックス100、長さ3で適切な値を取得できる", function () {
            var paths = monacoin.getPaths(1, 100, 3);
            chai_1.assert.deepEqual(paths[0], "m/49'/22'/0'/1/100");
            chai_1.assert.deepEqual(paths[1], "m/49'/22'/0'/1/101");
            chai_1.assert.deepEqual(paths[2], "m/49'/22'/0'/1/102");
        });
    });
    describe("getAddress() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん");
        });
        it("正しいアドレスが生成される", function () {
            var path1 = monacoin.getPath(0, 0);
            var address1 = monacoin.getAddress(path1);
            var path2 = monacoin.getPath(0, 1);
            var address2 = monacoin.getAddress(path2);
            chai_1.assert.deepEqual(address1, "PWimVa6tr6BaUX85ukxvuV1A8E5EnRpSqX");
            chai_1.assert.deepEqual(address2, "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
        });
        it("英語のMnemonicからも正しいアドレスが生成される", function () {
            var monacoin2 = new monacoin_1.default("trend pledge shrug defense country task gain library mad fold plastic shock");
            var path1 = monacoin2.getPath(0, 0);
            var address1 = monacoin2.getAddress(path1);
            var path2 = monacoin2.getPath(0, 1);
            var address2 = monacoin2.getAddress(path2);
            chai_1.assert.deepEqual(address1, "PAuEJKctkDGaovTDXDVENLCJ1ARKeQcwT6");
            chai_1.assert.deepEqual(address2, "PXiG48h62iGfaDWdMez4JkYgJHFB8hP7pb");
        });
    });
    describe("getAddresses() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん");
        });
        it("複数の正しいアドレスが生成される", function () {
            var paths = monacoin.getPaths(0, 0, 2);
            var addresses = monacoin.getAddresses(paths);
            chai_1.assert.deepEqual(addresses[0], "PWimVa6tr6BaUX85ukxvuV1A8E5EnRpSqX");
            chai_1.assert.deepEqual(addresses[1], "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
        });
        it("長さ1のとき、正しいアドレスが1つ入った配列が生成される", function () {
            var paths = monacoin.getPaths(0, 1, 1);
            var addresses = monacoin.getAddresses(paths);
            chai_1.assert.deepEqual(addresses[0], "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
        });
        it("長さ0のとき、空の配列が生成される", function () {
            var paths = monacoin.getPaths(0, 0, 0);
            var addresses = monacoin.getAddresses(paths);
            chai_1.assert.deepEqual(addresses, []);
        });
    });
    describe("updateAddressInfos() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん", "test");
        });
        it("アドレス情報が更新される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var initialAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, monacoin.updateAddressInfos({
                            receivingAddressNum: 14,
                            changeAddressNum: 6
                        })];
                    case 1:
                        _a.sent();
                        initialAddress = monacoin.addressInfos.find(function (info) {
                            return info.index === 0 && info.isChange === false;
                        });
                        chai_1.assert.deepEqual(initialAddress.address, "p6jm4kuLCWozhhD9BP6t7Y5zEkXHVcYV7b");
                        chai_1.assert.deepEqual(initialAddress.isSpent, true);
                        chai_1.assert.deepEqual(initialAddress.path, "m/49'/1'/0'/0/0");
                        chai_1.assert.isNotEmpty(initialAddress.txids);
                        chai_1.assert.isTrue(monacoin.addressInfos.filter(function (info) {
                            return !info.isChange;
                        }).length >= 14);
                        chai_1.assert.isTrue(monacoin.addressInfos.filter(function (info) {
                            return info.isChange;
                        }).length >= 6);
                        chai_1.assert.deepEqual(monacoin.balance, "499950200");
                        chai_1.assert.deepEqual(monacoin.balanceReadable, "4.999502");
                        chai_1.assert.deepEqual(monacoin.receiveAddress, monacoin.addressInfos.find(function (info) {
                            return !info.isChange && !info.isSpent;
                        }).address);
                        chai_1.assert.deepEqual(monacoin.changeAddress, monacoin.addressInfos.find(function (info) {
                            return info.isChange && !info.isSpent;
                        }).address);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("updateTxInfos() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん", "test");
        });
        it("トランザクション情報が更新される", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, monacoin.updateTxInfos()];
                    case 1:
                        _a.sent();
                        chai_1.assert.deepEqual(monacoin.txInfos.length, 4);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("estimateFeeRate() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん", "main");
        });
        it("150watanabe/byte以上の手数料が取得される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var feeRate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, monacoin.estimateFeeRate("min")];
                    case 1:
                        feeRate = _a.sent();
                        chai_1.assert.isTrue(new bignumber_js_1.default(feeRate).gte(150));
                        return [2 /*return*/];
                }
            });
        }); });
        it("fast normal slow min の順に手数料が小さくなる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var feeRate_fast, feeRate_normal, feeRate_slow, feeRate_min;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, monacoin.estimateFeeRate("fast")];
                    case 1:
                        feeRate_fast = _a.sent();
                        return [4 /*yield*/, monacoin.estimateFeeRate("normal")];
                    case 2:
                        feeRate_normal = _a.sent();
                        return [4 /*yield*/, monacoin.estimateFeeRate("slow")];
                    case 3:
                        feeRate_slow = _a.sent();
                        return [4 /*yield*/, monacoin.estimateFeeRate("min")];
                    case 4:
                        feeRate_min = _a.sent();
                        chai_1.assert.isTrue(new bignumber_js_1.default(feeRate_fast).gte(new bignumber_js_1.default(feeRate_normal)), "feeRate_fast >= feeRate_normal");
                        chai_1.assert.isTrue(new bignumber_js_1.default(feeRate_normal).gte(new bignumber_js_1.default(feeRate_slow)), "feeRate_normal >= feeRate_slow");
                        chai_1.assert.isTrue(new bignumber_js_1.default(feeRate_slow).gte(new bignumber_js_1.default(feeRate_min)), "feeRate_slow >= feeRate_min");
                        chai_1.assert.isTrue(new bignumber_js_1.default(feeRate_min).eq(new bignumber_js_1.default(monacoin.minFeeRate)), "feeRate_min >= monacoin.minFeeRate");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("updateUnsignedTx() のユニットテスト", function () {
        var monacoin;
        before("インスタンス作成", function () {
            monacoin = new monacoin_1.default("なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう", "test");
        });
        it("unsignedTxに含まれるデータの整合性が取れている", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, amount, amount_mona, fees, fees_mona, feeRate, sumInput, sumInput_mona, inputCount, toAddress;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, monacoin.updateUnsignedTx({
                            toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                            amount: "1000000",
                            feeRate: 150
                        })];
                    case 1:
                        _b.sent();
                        _a = monacoin.getUnsignedTxSummary(), amount = _a.amount, amount_mona = _a.amount_mona, fees = _a.fees, fees_mona = _a.fees_mona, feeRate = _a.feeRate, sumInput = _a.sumInput, sumInput_mona = _a.sumInput_mona, inputCount = _a.inputCount, toAddress = _a.toAddress;
                        chai_1.assert.isTrue(new bignumber_js_1.default(sumInput)
                            .minus(new bignumber_js_1.default(amount))
                            .minus(new bignumber_js_1.default(fees))
                            .gte(0));
                        chai_1.assert.deepEqual(toAddress, "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs");
                        chai_1.assert.isTrue(inputCount > 0);
                        chai_1.assert.deepEqual(new bignumber_js_1.default(amount).dividedBy(monacoin.digit).toString(), amount_mona);
                        chai_1.assert.deepEqual(new bignumber_js_1.default(fees).dividedBy(monacoin.digit).toString(), fees_mona);
                        chai_1.assert.deepEqual(new bignumber_js_1.default(sumInput).dividedBy(monacoin.digit).toString(), sumInput_mona);
                        chai_1.assert.deepEqual(feeRate, 150);
                        return [2 /*return*/];
                }
            });
        }); });
        it("amountに最小アウトプットよりも小さい値を指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: new bignumber_js_1.default(monacoin.minOutValue).minus(1).toString(),
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_1 = _a.sent();
                        chai_1.assert.deepEqual(err_1.message, "送金額が不適切です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("amountにマイナスを指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "-1000",
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_2 = _a.sent();
                        chai_1.assert.deepEqual(err_2.message, "送金額が不適切です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("amountに小数を指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "100000.1",
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_3 = _a.sent();
                        chai_1.assert.deepEqual(err_3.message, "送金額が不適切です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("amountに数字以外の文字列を指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "aaa",
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_4 = _a.sent();
                        chai_1.assert.deepEqual(err_4.message, "送金額が不適切です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("amountに残高を超える金額を指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "100000000000",
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_5 = _a.sent();
                        chai_1.assert.deepEqual(err_5.message, "残高不足です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("feeRateにminFeeRateを下回る金額を指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "1000000",
                                feeRate: 50
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_6 = _a.sent();
                        chai_1.assert.deepEqual(err_6.message, "手数料のレートが不適切です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("feeRateに小数を指定するとエラーがthrowされる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "1000000",
                                feeRate: 200.5
                            })];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが発生しませんでした");
                    case 2:
                        err_7 = _a.sent();
                        chai_1.assert.deepEqual(err_7.message, "手数料のレートが不適切です");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("全UTXOの合計額が送金額と手数料を上回るが、おつりを作れない場合、おつりなしで手数料多めのトランザクションが作成される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var getUtxos, utxos, sumInput, estimateFees, signedSummary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getUtxos = function (monacoin) {
                            var spentOutputs = [];
                            monacoin.txInfos.forEach(function (txInfo) {
                                txInfo.vin.forEach(function (input) {
                                    spentOutputs.push(input.txid + ":" + (input.vout || 0));
                                });
                            });
                            var utxos = []; // key: "txid:vout", value: value
                            monacoin.txInfos.sort(function (a, b) {
                                return b.confirmations - a.confirmations;
                            });
                            monacoin.txInfos.forEach(function (txInfo) {
                                txInfo.vout.forEach(function (output) {
                                    if (spentOutputs.indexOf(txInfo.txid + ":" + output.n) < 0) {
                                        var info = monacoin.addressInfos.find(function (info) {
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
                        return [4 /*yield*/, monacoin.updateAddressInfos()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, monacoin.updateTxInfos()];
                    case 2:
                        _a.sent();
                        utxos = getUtxos(monacoin);
                        sumInput = utxos.reduce(function (sum, elm) {
                            return new bignumber_js_1.default(sum).plus(elm.amount).toString();
                        }, "0");
                        estimateFees = estimateTxBytes_1.default({ "P2SH-P2WPKH": utxos.length }, { P2SH: 1 }) * 150;
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: new bignumber_js_1.default(sumInput)
                                    .minus(estimateFees)
                                    .minus(100)
                                    .toString(),
                                feeRate: 150
                            })];
                    case 3:
                        _a.sent();
                        monacoin.signTx();
                        signedSummary = monacoin.getSignedTxSummary();
                        chai_1.assert.isNull(signedSummary.change);
                        chai_1.assert.deepEqual(signedSummary.fees, new bignumber_js_1.default(estimateFees).plus(100).toString());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("signTx() のユニットテスト", function () {
        var monacoin;
        beforeEach("インスタンス作成", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        monacoin = new monacoin_1.default("なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう", "test");
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "1000000",
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () {
            monacoin.deleteSignedTx();
        });
        it("署名後のトランザクションの情報が取得できる", function () {
            monacoin.signTx();
            var summary = monacoin.getSignedTxSummary();
            chai_1.assert.deepEqual(summary.outs[0].address, "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs");
            chai_1.assert.deepEqual(summary.change.address, monacoin.changeAddress);
            chai_1.assert.deepEqual(summary.amount, "1000000");
            chai_1.assert.deepEqual(summary.configuredFeeRate, 150);
        });
    });
    describe("broadcastTx() のユニットテスト", function () {
        var monacoin;
        beforeEach("インスタンス作成", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        monacoin = new monacoin_1.default("なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう", "test");
                        return [4 /*yield*/, monacoin.updateUnsignedTx({
                                toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                                amount: "1000000",
                                feeRate: 150
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, monacoin.signTx()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("署名済みトランザクションがない場合、nullが返される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        monacoin.deleteSignedTx();
                        return [4 /*yield*/, monacoin.broadcastTx()];
                    case 1:
                        txid = _a.sent();
                        chai_1.assert.isNull(txid);
                        return [2 /*return*/];
                }
            });
        }); });
        it("トランザクションを送信するとtxidが返される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var summary, txid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        summary = monacoin.getSignedTxSummary();
                        return [4 /*yield*/, monacoin.broadcastTx()];
                    case 1:
                        txid = _a.sent();
                        chai_1.assert.deepEqual(txid, summary.txid);
                        return [2 /*return*/];
                }
            });
        }); });
        it("最小アウトプットの金額のトランザクションを送信するとtxidが返される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var summary, txid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, monacoin.updateUnsignedTx({
                            toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
                            amount: monacoin.minOutValue,
                            feeRate: 150
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, monacoin.signTx()];
                    case 2:
                        _a.sent();
                        summary = monacoin.getSignedTxSummary();
                        return [4 /*yield*/, monacoin.broadcastTx()];
                    case 3:
                        txid = _a.sent();
                        chai_1.assert.deepEqual(txid, summary.txid);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("updateHistory() のユニットテスト", function () {
        var monacoin;
        beforeEach("インスタンス作成", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                monacoin = new monacoin_1.default("なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう", "test");
                return [2 /*return*/];
            });
        }); });
        it("txInfoがない状態で実行してもtxHistoriesは[]となっている", function () {
            monacoin.updateHistory();
            chai_1.assert.isEmpty(monacoin.txHistories);
        });
        it("正しいbalanceが計算できている", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sleep(1000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, monacoin.updateAddressInfos()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, monacoin.updateTxInfos()];
                    case 3:
                        _a.sent();
                        monacoin.updateHistory();
                        chai_1.assert.deepEqual(monacoin.txHistories[0].balance, monacoin.balanceReadable);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getMnemonic() のユニットテスト", function () {
        var monacoin;
        beforeEach("インスタンス作成", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                monacoin = new monacoin_1.default("なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう", "test");
                return [2 /*return*/];
            });
        }); });
        it("Mnemonicを正しく取得できる", function () {
            chai_1.assert.deepEqual(monacoin.getMnemonic(), "なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう");
        });
    });
});
