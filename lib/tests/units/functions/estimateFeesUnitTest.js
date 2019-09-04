"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var estimateFees_1 = require("../../../functions/estimateFees");
var chai_1 = require("chai");
describe("estimateFees のユニットテスト", function () {
    var options;
    beforeEach(function () {
        options = {
            inputLength: 1,
            outputLength: 1,
            hasChange: true,
            feeRate: 150,
            inputType: "P2SH-P2WPKH",
            outputType: "P2PKH"
        };
    });
    it("手数料を計算できる", function () {
        var fees = estimateFees_1.default(options);
        chai_1.assert.deepEqual(fees, "25200");
    });
    it("入力・出力・おつりがない場合に入出力を除く部分の手数料を計算できる", function () {
        options.hasChange = false;
        options.inputLength = 0;
        options.outputLength = 0;
        var fees = estimateFees_1.default(options);
        chai_1.assert.deepEqual(fees, "1650");
    });
    it("存在しないinputTypeを指定した場合、エラーをthrowする", function () {
        try {
            options.inputType = "INVALID";
            var fees = estimateFees_1.default(options);
            console.log(fees);
            throw new Error("エラーが発生しませんでした");
        }
        catch (err) {
            chai_1.assert.notDeepEqual(err.message, "エラーが発生しませんでした");
        }
    });
});
