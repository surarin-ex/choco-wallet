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
var blockbook_1 = require("../../../classes/blockbook");
var blockbookList_1 = require("../../../conf/blockbookList");
var chai_1 = require("chai");
describe("Blockbook のユニットテスト", function () {
    describe("createBlockbook() のユニットテスト", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("初期化できる", function () { return __awaiter(void 0, void 0, void 0, function () {
                var blockbook, uris;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, blockbook_1.default()];
                        case 1:
                            blockbook = _a.sent();
                            uris = blockbookList_1.default.map(function (endpoint) {
                                return endpoint.uri;
                            });
                            chai_1.assert.deepInclude(uris, blockbook.endpoint);
                            chai_1.assert.deepEqual(blockbook.coin, "Monacoin");
                            chai_1.assert.deepEqual(blockbook.chain, "main");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("テストネットで初期化できる", function () { return __awaiter(void 0, void 0, void 0, function () {
                var blockbook, uris;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                        case 1:
                            blockbook = _a.sent();
                            uris = blockbookList_1.default.map(function (endpoint) {
                                return endpoint.uri;
                            });
                            chai_1.assert.deepInclude(uris, blockbook.endpoint);
                            chai_1.assert.deepEqual(blockbook.coin, "Monacoin Testnet");
                            chai_1.assert.deepEqual(blockbook.chain, "test");
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("getAddressInfo() のユニットテスト", function () {
        var blockbook;
        before("testnetで初期化", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("取引実績のあるアドレス情報を取得できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var addressInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.getBlockbookAddress("pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n")];
                    case 1:
                        addressInfo = _a.sent();
                        chai_1.assert.deepEqual(addressInfo.page, 1);
                        chai_1.assert.deepEqual(addressInfo.totalPages, 1);
                        chai_1.assert.deepEqual(addressInfo.itemsOnPage, 1000);
                        chai_1.assert.deepEqual(addressInfo.address, "pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n");
                        chai_1.assert.deepEqual(addressInfo.balance, "0");
                        chai_1.assert.deepEqual(addressInfo.totalReceived, "332000000");
                        chai_1.assert.deepEqual(addressInfo.totalSent, "332000000");
                        chai_1.assert.deepEqual(addressInfo.unconfirmedBalance, "0");
                        chai_1.assert.deepEqual(addressInfo.unconfirmedTxs, 0);
                        chai_1.assert.deepEqual(addressInfo.txs, 5);
                        chai_1.assert.deepEqual(addressInfo.txids, [
                            "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff",
                            "1b0f415d238a99f1d0334061ae25e89b198069f65d14fe967181aa9b0a961fe0",
                            "301b5f8aa9f7e2a87987994adcf99ce354b9a525f6f0b7175d4705bc00e656a4",
                            "9216bc0f77d5c8b6c4957ef0a5b301abe76fe2ab83b09ec1ea964dff98cfba3e",
                            "d388f60337c43495e3db6b882350b6188e7f5ffcfb1c8f5ed8b792bc0486d788"
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("取引実績のないアドレス情報を取得できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var addressInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.getBlockbookAddress("pNdFKgQTK1PFeeBiBfbY9MpDouCbNRmAyt")];
                    case 1:
                        addressInfo = _a.sent();
                        chai_1.assert.deepEqual(addressInfo.page, 1);
                        chai_1.assert.deepEqual(addressInfo.totalPages, 1);
                        chai_1.assert.deepEqual(addressInfo.itemsOnPage, 1000);
                        chai_1.assert.deepEqual(addressInfo.address, "pNdFKgQTK1PFeeBiBfbY9MpDouCbNRmAyt");
                        chai_1.assert.deepEqual(addressInfo.balance, "0");
                        chai_1.assert.deepEqual(addressInfo.totalReceived, "0");
                        chai_1.assert.deepEqual(addressInfo.totalSent, "0");
                        chai_1.assert.deepEqual(addressInfo.unconfirmedBalance, "0");
                        chai_1.assert.deepEqual(addressInfo.unconfirmedTxs, 0);
                        chai_1.assert.deepEqual(addressInfo.txs, 0);
                        chai_1.assert.isUndefined(addressInfo.txids);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getAddressInfos() のユニットテスト", function () {
        var blockbook;
        var addresses = [
            "pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n",
            "p87WBVtXHiJoxUTtnFawuaNK1uiErYsTTD",
            "pSK6eGBMtaY5uwythgzLmisQE8nz8JdG6S",
            "p9itkWdw8H5T1ZdZnBjyGL6AUyPK2HZBgV",
            "pEuK4ffetaAUHRtwQQvzkEhKMYVa2pb8ba",
            "pP9MzRUvFLpDMg53HTCXgt6dyxgeMAK6Bc",
            "pS1irqkEh5ekRq1Lmhg6VHwncccfTDvosW",
            "pFh73SeGpu3ttNHAxsVu3grsQhrgq95BDL",
            "pRj7bagxt8L5amDkxCtzsXSitBNURpC5G2",
            "pSvU4HqLJ3iDJ3cYxiaTmz3zmn6nDBUCi5",
            "pAL2nJYHWw5JamQsVgX4efyJ9zcKf611ag",
            "pNukdwq7etemieXPsPjjRYUq8HW5RTpStw",
            "p9saYVd4ZfqJQYJ7xMXdffJesry6BKxofP",
            "pBD4TrrFDGKHUNbptQxnm2hxsg5wu53boY",
            "pJVcF5N6aADSHsLKM8euqyra2KqoDsVBf8",
            "pMNJQVB5iX9MyRfMRrpweQ9dpR1WBie2BQ",
            "pTVKfWobV57RXbbE4852jkx2e63JhLotmh",
            "pCtTqch8X6B95DGfA3XrGBmXHTYf1sW1sG",
            "pQwFupKyXxweZNbNupCikwChfivRvLn9tP",
            "p92eKTg3ENbyaE2GDAxgTZYegp3Y6riwaW",
            "pUD7D4dqqWBjJBdRdYJW9XsvxXsYcZd7Ub",
            "pQNK2FXxsLK3miya5SECsRSUwXbakb5zau",
            "pLh6EuQoFRNVv5efcqU8qqiMJVPqvb65TV",
            "pNdFKgQTK1PFeeBiBfbY9MpDouCbNRmAyt",
            "pM1EMe8E3ngsJEoaAb1gjrdUiaRPMYW3E8",
            "pMn2R44yuZQdxNZYbzMx7YpAFpY4TP2ooL",
            "pNKD9yAGhsbRMr6uvbzqYY3tKsTLmbBBRu",
            "pE4whubV3yp8rjatCGZJArAAvr9pyJDfV6",
            "p8naCdQNrF4kmCqT8mtsCAVwZuHKTzob2a",
            "pKavEGHz4KrcMtdckvhMTeEXDxsVEszJxM",
            "p9rciTjpQTfESCNgc8gqWvjjUsp9mNjepY",
            "pTcwCTErvgzP64V2jfiWWZuHRpdmVrCdKF",
            "pCuVaeD5QL6WGx9Q3gqAKRPSxZKKnfBaTP",
            "pCcsJyEPMa44G499KsYgdnAiz2umia2G8K",
            "pH316wnSqMzz6GgdqUmp1KzkDXALsMwoCL",
            "p7FwKnSLkXSYSqCBiqZtkQYau7fcb27j5g"
        ];
        before("testnetで初期化", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("複数のアドレス情報を取得できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var addressInfos, _i, addressInfos_1, addressInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.getBlockbookAddresses(addresses)];
                    case 1:
                        addressInfos = _a.sent();
                        for (_i = 0, addressInfos_1 = addressInfos; _i < addressInfos_1.length; _i++) {
                            addressInfo = addressInfos_1[_i];
                            chai_1.assert.deepInclude(addresses, addressInfo.address);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getTxInfo() のユニットテスト", function () {
        var blockbook;
        before("testnetで初期化", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("トランザクション情報を取得できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txid, txInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txid = "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff";
                        return [4 /*yield*/, blockbook.getBlockbookTx(txid)];
                    case 1:
                        txInfo = _a.sent();
                        chai_1.assert.deepEqual(txInfo.txid, "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff");
                        chai_1.assert.deepEqual(txInfo.vin[0].addresses[0], "pNKD9yAGhsbRMr6uvbzqYY3tKsTLmbBBRu");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getBlockbookTxs() のユニットテスト", function () {
        var blockbook;
        var txids = [
            "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff",
            "1b0f415d238a99f1d0334061ae25e89b198069f65d14fe967181aa9b0a961fe0"
        ];
        before("testnetで初期化", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("複数のトランザクション情報を取得できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txInfos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.getBlockbookTxs(txids)];
                    case 1:
                        txInfos = _a.sent();
                        chai_1.assert.deepEqual(txInfos[0].txid, "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff");
                        chai_1.assert.deepEqual(txInfos[1].txid, "1b0f415d238a99f1d0334061ae25e89b198069f65d14fe967181aa9b0a961fe0");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("estimateBlockbookFeeRate() のユニットテスト", function () {
        var blockbook;
        before("mainnetで初期化", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("main", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("手数料率を取得できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            var feeRate, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, blockbook.estimateBlockbookFeeRate(2)];
                    case 1:
                        feeRate = _a.sent();
                        chai_1.assert.isNotNaN(Number(feeRate), "feeRate: " + feeRate);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        throw new Error("feeRateの取得に失敗");
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("broadcastTx() のユニットテスト", function () {
        var blockbook;
        before("testnetで初期化", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("形式的に誤ったtxを送信した場合にエラーが返される", function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, blockbook.broadcastTx("aaaaa")];
                    case 1:
                        _a.sent();
                        throw new Error("エラーが返されませんでした");
                    case 2:
                        err_2 = _a.sent();
                        chai_1.assert.notDeepEqual(err_2.message, "エラーが返されませんでした");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("connect() のユニットテスト", function () {
        var blockbook;
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () {
            blockbook.disconnect();
        });
        it("Callback関数形式の使用方法で接続できる", function (done) {
            blockbook.connect(done);
        });
        it("Promise形式の使用方法で接続できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("subscribeAddressTxid() のユニットテスト", function () {
        var blockbook;
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook_1.default("test", "Monacoin")];
                    case 1:
                        blockbook = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () {
            blockbook.disconnect();
        });
        it("Callback関数形式の使用方法で購読できる", function (done) {
            blockbook.subscribeAddressTxid(["pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n"], done);
        });
        it("Promise形式の使用方法で接続できる", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockbook.subscribeAddressTxid([
                            "pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n"
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
