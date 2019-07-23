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
var blockbookList_1 = require("../conf/blockbookList");
var axios_1 = require("axios");
/**
 * Blockbook クラス
 */
var Blockbook = /** @class */ (function () {
    function Blockbook() {
    }
    Blockbook.prototype.init = function (chain, coin) {
        if (chain === void 0) { chain = "main"; }
        if (coin === void 0) { coin = "Monacoin"; }
        return __awaiter(this, void 0, void 0, function () {
            var initialIndex, endpoint, list, i, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initialIndex = Math.floor(Math.random() * blockbookList_1.default.length);
                        list = blockbookList_1.default.filter(function (blockbook) {
                            return blockbook.chain === chain && blockbook.coin === coin;
                        });
                        i = initialIndex;
                        _a.label = 1;
                    case 1:
                        if (!(i < initialIndex + list.length)) return [3 /*break*/, 6];
                        endpoint = list[i % list.length].uri;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.get(endpoint)];
                    case 3:
                        res = _a.sent();
                        if (res.data.blockbook.coin !== coin)
                            throw new Error("Invalid coin: " + res.data.blockbook.coin);
                        if (res.data.backend.chain !== chain)
                            throw new Error("Invalid chain: " + res.data.backend.chain);
                        if (res.data.blockbook.inSync === false)
                            throw new Error("Not syncing chain");
                        if (res.data.blockbook.inSyncMempool === false)
                            throw new Error("Not syncing mempool");
                        this.endpoint = endpoint;
                        this.coin = res.data.blockbook.coin;
                        this.chain = res.data.backend.chain;
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        if (i === initialIndex + blockbookList_1.default.length - 1) {
                            throw err_1;
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * アドレス情報を取得するメソッド
     * @param address アドレス
     */
    Blockbook.prototype.getAddressInfo = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        uri = this.endpoint + "/v2/address/" + address;
                        return [4 /*yield*/, axios_1.default.get(uri)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_2 = _a.sent();
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 複数のアドレス情報を取得するメソッド
     * @param addresses アドレスリスト
     */
    Blockbook.prototype.getAddressInfos = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, addresses_1, address, addressInfos, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        promises = [];
                        for (_i = 0, addresses_1 = addresses; _i < addresses_1.length; _i++) {
                            address = addresses_1[_i];
                            promises.push(this.getAddressInfo(address));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        addressInfos = _a.sent();
                        return [2 /*return*/, addressInfos];
                    case 2:
                        err_3 = _a.sent();
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * トランザクション情報を取得するメソッド
     * @param txid トランザクション ID
     */
    Blockbook.prototype.getTxInfo = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, res, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        uri = this.endpoint + "/v2/tx/" + txid;
                        return [4 /*yield*/, axios_1.default.get(uri)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_4 = _a.sent();
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 複数のトランザクション情報を取得するメソッド
     * @param txids トランザクション IDの配列
     */
    Blockbook.prototype.getTxInfos = function (txids) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, txids_1, txid, txInfos, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        promises = [];
                        for (_i = 0, txids_1 = txids; _i < txids_1.length; _i++) {
                            txid = txids_1[_i];
                            promises.push(this.getTxInfo(txid));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        txInfos = _a.sent();
                        return [2 /*return*/, txInfos];
                    case 2:
                        err_5 = _a.sent();
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Blockbook;
}());
exports.Blockbook = Blockbook;
/**
 * Blockbookのクラスをインスタンス化する関数
 * @param chain チェーンの指定 "main" or "test"
 * @param coin コインの指定 "Monacoin"
 */
var createBlockbook = function (chain, coin) {
    if (chain === void 0) { chain = "main"; }
    if (coin === void 0) { coin = "Monacoin"; }
    return __awaiter(_this, void 0, void 0, function () {
        var obj, coinName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    obj = new Blockbook();
                    if (chain === "main") {
                        coinName = coin;
                    }
                    else {
                        coinName = coin + " Testnet";
                    }
                    return [4 /*yield*/, obj.init(chain, coinName)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, obj];
            }
        });
    });
};
exports.default = createBlockbook;
