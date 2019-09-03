"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var estimateTxBytes_1 = require("./estimateTxBytes");
// 手数料の推定
var estimateFees = function (selectedUtxos, hasChange, options) {
    var inputs = {};
    var outputs = {};
    inputs[options.inputType] = selectedUtxos.length;
    if (hasChange) {
        var changeType = options.inputType.slice(0, 4) === "P2SH" ? "P2SH" : options.inputType;
        outputs[changeType] = 1;
    }
    outputs[options.outputType] = 1;
    var estimateFees = (estimateTxBytes_1.default(inputs, outputs) * options.feeRate).toString();
    return estimateFees;
};
exports.default = estimateFees;
