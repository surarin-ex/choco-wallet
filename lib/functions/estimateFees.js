"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var estimateTxBytes_1 = require("./estimateTxBytes");
/**
 * 手数料を推定する関数
 * @param options 引数のオブジェクト
 */
var estimateFees = function (options) {
    var inputs = {};
    var outputs = {};
    inputs[options.inputType] = options.inputLength;
    outputs[options.outputType] = options.outputLength;
    if (options.hasChange) {
        var changeType = options.inputType.slice(0, 4) === "P2SH" ? "P2SH" : options.inputType;
        if (changeType === options.outputType) {
            outputs[changeType]++;
        }
        else {
            outputs[changeType] = 1;
        }
    }
    var estimateFees = (estimateTxBytes_1.default(inputs, outputs) * options.feeRate).toString();
    if (estimateFees === "NaN") {
        throw new Error("inputTypeまたはoutputTypeが不正です");
    }
    return estimateFees;
};
exports.default = estimateFees;
