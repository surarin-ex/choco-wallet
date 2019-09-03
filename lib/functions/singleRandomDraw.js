"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shuffleArray_1 = require("./shuffleArray");
var getUtxosValue_1 = require("./getUtxosValue");
var bignumber_js_1 = require("bignumber.js");
var estimateFees_1 = require("./estimateFees");
/**
 * Single Random Draw アルゴリズムにより、UTXOを選択する。
 * 残高不足の場合はselectedUtxoに空の配列が返される。
 * @param options 引数のオブジェクト
 */
var singleRandomDraw = function (options) {
    var selectedUtxos = [];
    var shuffledUtxos = shuffleArray_1.default(options.utxos);
    // UTXOの判定条件
    var isInsufficientInputs = function (selectedUtxos, options, hasChange) {
        var sumInput = new bignumber_js_1.default(getUtxosValue_1.default(selectedUtxos));
        var requirement = new bignumber_js_1.default(options.amount).plus(estimateFees_1.default(selectedUtxos, hasChange, options));
        if (hasChange) {
            requirement = requirement.plus(options.minOutValue);
        }
        return sumInput.lt(requirement);
    };
    var isInSufficient = false;
    var hasChange = true;
    while ((isInSufficient = isInsufficientInputs(selectedUtxos, options, hasChange))) {
        if (shuffledUtxos[0]) {
            selectedUtxos.push(shuffledUtxos[0]);
            shuffledUtxos.splice(0, 1);
        }
        else {
            break;
        }
    }
    if (!isInSufficient) {
        var fees = estimateFees_1.default(selectedUtxos, hasChange, options);
        return { selectedUtxos: selectedUtxos, hasChange: hasChange, fees: fees };
    }
    else {
        hasChange = false;
        isInSufficient = isInsufficientInputs(selectedUtxos, options, hasChange);
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
