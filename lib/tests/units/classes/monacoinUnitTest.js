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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var monacoin_1 = require("../../../classes/monacoin");
var chai_1 = require("chai");
describe.only("Monacoin のユニットテスト", function () {
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
        it("アドレス情報が更新される", function () { return __awaiter(_this, void 0, void 0, function () {
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
        it("トランザクション情報が更新される", function () { return __awaiter(_this, void 0, void 0, function () {
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
});
