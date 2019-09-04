"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var singleRandomDraw_1 = require("../../../functions/singleRandomDraw");
var getUtxosValue_1 = require("../../../functions/getUtxosValue");
var chai_1 = require("chai");
var bignumber_js_1 = require("bignumber.js");
describe("singRandomDraw() のユニットテスト", function () {
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
            amount: "1950000",
            minOutValue: "63000"
        };
    });
    it("選択されたUTXOが重複なく十分な残高を含んでいる", function () {
        var _loop_1 = function (i) {
            var result = singleRandomDraw_1.default(options);
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
    it("おつりを作らない場合に、インプットの合計と送金額+手数料が一致する", function () {
        options.amount = "5950000";
        var result = singleRandomDraw_1.default(options);
        var sumInput = getUtxosValue_1.default(result.selectedUtxos);
        chai_1.assert.isFalse(result.hasChange);
        chai_1.assert.deepEqual(new bignumber_js_1.default(sumInput).toString(), new bignumber_js_1.default(options.amount).plus(result.fees).toString(), "インプットの量が送金額と手数料の合計額と一致する");
    });
    it("残高不足の場合に、エラーがthrowされる", function () {
        try {
            options.amount = "15950000";
            singleRandomDraw_1.default(options);
            throw new Error("エラーがthrowされませんでした");
        }
        catch (err) {
            chai_1.assert.notDeepEqual(err.message, "エラーがthrowされませんでした");
        }
    });
});
