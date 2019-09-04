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
var branchAndBound_1 = require("../../../functions/branchAndBound");
var getUtxosValue_1 = require("../../../functions/getUtxosValue");
var chai_1 = require("chai");
var bignumber_js_1 = require("bignumber.js");
var estimateFees_1 = require("../../../functions/estimateFees");
describe("branchAndBound() のユニットテスト", function () {
    var options;
    beforeEach(function () {
        options = {
            utxos: [
                {
                    txid: "txid1",
                    index: 0,
                    amount: "1000000",
                    script: "",
                    txHex: "",
                    path: "",
                    confirmations: 1000
                },
                {
                    txid: "txid2",
                    index: 0,
                    amount: "2000000",
                    script: "",
                    txHex: "",
                    path: "",
                    confirmations: 1000
                },
                {
                    txid: "txid3",
                    index: 0,
                    amount: "3000000",
                    script: "",
                    txHex: "",
                    path: "",
                    confirmations: 1000
                }
            ],
            feeRate: 150,
            inputType: "P2SH-P2WPKH",
            outputType: "P2PKH",
            amount: "1550000",
            minOutValue: "63000"
        };
    });
    it("BnBでmatchしない場合、SRDで選択されてUTXOが重複なく十分な残高を含んでいる", function () {
        var _loop_1 = function (i) {
            var result = branchAndBound_1.default(options);
            var sumInput = getUtxosValue_1.default(result.selectedUtxos);
            var count = {
                txid1: 0,
                txid2: 0,
                txid3: 0
            };
            result.selectedUtxos.forEach(function (utxo) {
                count[utxo.txid]++;
            });
            chai_1.assert.isTrue(new bignumber_js_1.default(sumInput)
                .minus(result.fees)
                .minus(options.minOutValue)
                .gt(0));
            chai_1.assert.isTrue(count.txid1 <= 1, "txid1 <= 1");
            chai_1.assert.isTrue(count.txid2 <= 1, "txid2 <= 1");
            chai_1.assert.isTrue(count.txid3 <= 1, "txid3 <= 1");
        };
        for (var i = 0; i < 10; i++) {
            _loop_1(i);
        }
    });
    it("全UTXOを使う場合でBnBでmatchする場合、インプットの合計と送金額+手数料が一致する", function () {
        options.amount = "5950000";
        var result = branchAndBound_1.default(options);
        var sumInput = getUtxosValue_1.default(result.selectedUtxos);
        chai_1.assert.isFalse(result.hasChange);
        chai_1.assert.deepEqual(new bignumber_js_1.default(sumInput).toString(), new bignumber_js_1.default(options.amount).plus(result.fees).toString(), "インプットの量が送金額と手数料の合計額と一致する");
    });
    it("全UTXOを使わない場合でBnBでmatchする場合、インプットの合計と送金額+手数料が一致する", function () {
        options.amount = "2950000";
        var result = branchAndBound_1.default(options);
        var sumInput = getUtxosValue_1.default(result.selectedUtxos);
        chai_1.assert.isFalse(result.hasChange);
        chai_1.assert.deepEqual(new bignumber_js_1.default(sumInput).toString(), new bignumber_js_1.default(options.amount).plus(result.fees).toString(), "インプットの量が送金額と手数料の合計額と一致する");
    });
    it("残高不足の場合に、エラーがthrowされる", function () {
        try {
            options.amount = "15950000";
            branchAndBound_1.default(options);
            throw new Error("エラーがthrowされませんでした");
        }
        catch (err) {
            chai_1.assert.notDeepEqual(err.message, "エラーがthrowされませんでした");
        }
    });
    it("インプットの合計と送金額+手数料が一致する場合に、すべてのUTXOが選択された結果が返される", function () {
        var fees = estimateFees_1.default(__assign({ inputLength: 3, outputLength: 1, hasChange: false }, options));
        options.amount = new bignumber_js_1.default(6000000).minus(fees).toString();
        var result = branchAndBound_1.default(options);
        chai_1.assert.isFalse(result.hasChange);
        chai_1.assert.deepEqual(result.selectedUtxos.length, 3);
        chai_1.assert.deepEqual(result.fees, fees);
    });
    it("送金額がインプットの合計-手数料よりも1だけ大きい場合に、エラーがthrowされる", function () {
        try {
            var fees = estimateFees_1.default(__assign({ inputLength: 3, outputLength: 1, hasChange: false }, options));
            options.amount = new bignumber_js_1.default(6000000)
                .minus(fees)
                .plus(1)
                .toString();
            var result = branchAndBound_1.default(options);
            console.log(result);
            throw new Error("エラーがthrowされませんでした");
        }
        catch (err) {
            chai_1.assert.notDeepEqual(err.message, "エラーがthrowされませんでした");
        }
    });
});
