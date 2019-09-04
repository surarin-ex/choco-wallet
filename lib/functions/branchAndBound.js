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
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var estimateFees_1 = require("./estimateFees");
var singleRandomDraw_1 = require("./singleRandomDraw");
var getUtxosValue_1 = require("./getUtxosValue");
/**
 * Branch and Bound アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はエラーがthrowされる。
 * @param options 引数のオブジェクト
 */
var branchAndBound = function (options) {
    var selectedUtxos = [];
    var bnbTries = 1000000;
    var costOfHeader = estimateFees_1.default(__assign({ inputLength: 0, outputLength: 0, hasChange: false }, options));
    var costPerOutput = new bignumber_js_1.default(estimateFees_1.default(__assign({ inputLength: 0, outputLength: 1, hasChange: false }, options))).minus(costOfHeader);
    var costPerInput = new bignumber_js_1.default(estimateFees_1.default(__assign({ inputLength: 1, outputLength: 0, hasChange: false }, options))).minus(costOfHeader);
    var costPerChange = new bignumber_js_1.default(estimateFees_1.default(__assign({ inputLength: 0, outputLength: 0, hasChange: true }, options))).minus(costOfHeader);
    var utxoSorted = Array.from(options.utxos).sort(function (a, b) {
        return new bignumber_js_1.default(b.amount).minus(a.amount).toNumber();
    });
    // effective valueを計算する関数
    var getEffValue = function (utxo) {
        var effValue = new bignumber_js_1.default(utxo.amount).minus(costPerInput);
        return effValue;
    };
    // Branch and Bound アルゴリズムによるUTXOの検索をする関数
    var bnbSearch = function (depth, selectedUtxos, effValue, amount) {
        var targetForMatch = amount.plus(costOfHeader).plus(costPerOutput);
        var matchRange = costPerInput.plus(costPerChange);
        bnbTries--;
        if (effValue.gt(targetForMatch.plus(matchRange))) {
            return [];
        }
        else if (effValue.gte(targetForMatch)) {
            return selectedUtxos;
        }
        else if (bnbTries <= 0) {
            return [];
        }
        else if (depth >= utxoSorted.length) {
            return [];
        }
        else {
            // ランダムに次のブランチを探索する
            var randomBoolean = Math.random() >= 0.5;
            if (randomBoolean) {
                // 先にUTXOを含める場合のブランチを探索し、その次に含めない場合のブランチを探索する
                var nextUtxos = Array.from(selectedUtxos);
                nextUtxos.push(utxoSorted[depth]);
                var nextEffValue = effValue.plus(getEffValue(utxoSorted[depth]));
                var withThis = bnbSearch(depth + 1, nextUtxos, nextEffValue, amount);
                if (withThis.length !== 0) {
                    return withThis;
                }
                else {
                    var withoutThis = bnbSearch(depth + 1, Array.from(selectedUtxos), effValue, amount);
                    if (withoutThis.length !== 0) {
                        return withoutThis;
                    }
                }
            }
            else {
                // 先にUTXOを含めない場合のブランチを探索し、その次に含める場合のブランチを探索する
                var withoutThis = bnbSearch(depth + 1, Array.from(selectedUtxos), effValue, amount);
                if (withoutThis.length !== 0) {
                    return withoutThis;
                }
                else {
                    var nextUtxos = Array.from(selectedUtxos);
                    nextUtxos.push(utxoSorted[depth]);
                    var nextEffValue = effValue.plus(getEffValue(utxoSorted[depth]));
                    var withThis = bnbSearch(depth + 1, nextUtxos, nextEffValue, amount);
                    if (withThis.length !== 0) {
                        return withThis;
                    }
                }
            }
            return [];
        }
    };
    selectedUtxos = bnbSearch(0, [], new bignumber_js_1.default(0), new bignumber_js_1.default(options.amount));
    if (selectedUtxos.length > 0) {
        return {
            selectedUtxos: selectedUtxos,
            hasChange: false,
            fees: new bignumber_js_1.default(getUtxosValue_1.default(selectedUtxos))
                .minus(options.amount)
                .toString()
        };
    }
    else {
        var result = singleRandomDraw_1.default(options);
        return result;
    }
};
exports.default = branchAndBound;
