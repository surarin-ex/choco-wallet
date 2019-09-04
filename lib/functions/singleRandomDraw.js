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
var shuffleArray_1 = require("./shuffleArray");
var getUtxosValue_1 = require("./getUtxosValue");
var bignumber_js_1 = require("bignumber.js");
var estimateFees_1 = require("./estimateFees");
/**
 * Single Random Draw アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はエラーがthrowされる。
 * @param options 引数のオブジェクト
 */
var singleRandomDraw = function (options) {
    var selectedUtxos = [];
    var shuffledUtxos = shuffleArray_1.default(options.utxos);
    // UTXOの判定条件
    var isInsufficientInputs = function (options) {
        var sumInput = new bignumber_js_1.default(getUtxosValue_1.default(selectedUtxos));
        var requirement = new bignumber_js_1.default(options.amount).plus(estimateFees_1.default(__assign({ inputLength: selectedUtxos.length, outputLength: 1, hasChange: options.hasChange }, options)));
        if (options.hasChange) {
            requirement = requirement.plus(options.minOutValue);
        }
        return sumInput.lt(requirement);
    };
    var isInSufficient = false;
    var hasChange = true;
    while ((isInSufficient = isInsufficientInputs(__assign({ selectedUtxos: selectedUtxos,
        hasChange: hasChange }, options)))) {
        if (shuffledUtxos[0]) {
            selectedUtxos.push(shuffledUtxos[0]);
            shuffledUtxos.splice(0, 1);
        }
        else {
            break;
        }
    }
    if (!isInSufficient) {
        var fees = estimateFees_1.default(__assign({ inputLength: selectedUtxos.length, outputLength: 1, hasChange: hasChange }, options));
        return { selectedUtxos: selectedUtxos, hasChange: hasChange, fees: fees };
    }
    else {
        hasChange = false;
        isInSufficient = isInsufficientInputs(__assign({ selectedUtxos: selectedUtxos,
            hasChange: hasChange }, options));
        if (!isInSufficient) {
            var fees = new bignumber_js_1.default(getUtxosValue_1.default(selectedUtxos))
                .minus(options.amount)
                .toString();
            return { selectedUtxos: selectedUtxos, hasChange: hasChange, fees: fees };
        }
        else {
            throw new Error("残高不足です");
        }
    }
};
exports.default = singleRandomDraw;
