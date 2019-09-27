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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var blockbook_1 = require("./blockbook");
/**
 * 指定したアドレスを監視するクラス
 */
var Monitor = /** @class */ (function () {
    /**
     * 初期化
     * @param coin コイン名
     * @param chain "main" or "test"
     */
    function Monitor(coin, chain) {
        if (coin === void 0) { coin = "Monacoin"; }
        if (chain === void 0) { chain = "main"; }
        this.coin = coin;
        this.chain = chain;
        this._addresses = [];
        this._callback = null;
    }
    /**
     * 初期化処理
     * Blockbookオブジェクトを生成して、Socket接続する
     * また、切断時のフォールバック処理を定義する
     */
    Monitor.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, blockbook_1.default(this.chain, this.coin)];
                    case 1:
                        _a._blockbook = _b.sent();
                        return [4 /*yield*/, this._blockbook.connect()];
                    case 2:
                        _b.sent();
                        this._blockbook.registerFallback(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.destroy();
                                        return [4 /*yield*/, this.init()];
                                    case 1:
                                        _a.sent();
                                        if (!(this._addresses.length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.addAddresses(this._addresses)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        if (this._callback) {
                                            this.setListener(this._callback);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 監視処理の破棄。
     * 監視中のアドレスリストは破棄しない
     */
    Monitor.prototype.destroy = function () {
        if (this._blockbook) {
            this._blockbook.disconnect();
        }
        this._blockbook = null;
    };
    /**
     * アドレスリストを監視対象に追加する
     * すでに監視中のアドレスはBlockbook側で無視されるので考慮しない
     * @param addresses アドレスリスト
     */
    Monitor.prototype.addAddresses = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            var tmp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmp = __spreadArrays(this._addresses, addresses);
                        this._addresses = tmp.filter(function (address, i, self) {
                            return self.indexOf(address) === i;
                        });
                        return [4 /*yield*/, this._blockbook.subscribeAddressTxid(addresses)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * アドレスリストを洗い替えするメソッド
     * Blockbookへの再接続をするので多少時間がかかる
     * @param addresses アドレスリスト
     */
    Monitor.prototype.replaceAddresses = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._addresses = [];
                        this.destroy();
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addAddresses(addresses)];
                    case 2:
                        _a.sent();
                        this.setListener(this._callback);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 監視中のアドレスに紐づくTXIDを受信したときの処理をセットするメソッド
     * @param callback コールバック関数
     */
    Monitor.prototype.setListener = function (callback) {
        this._callback = callback;
        this._blockbook.addSubscribeAddressTxidListener(callback);
    };
    /**
     * アドレスリストを取得する
     * 値渡しなので取得した内容を更新しても何も変化はない
     */
    Monitor.prototype.getAddresses = function () {
        return this._addresses.slice();
    };
    return Monitor;
}());
exports.default = Monitor;
