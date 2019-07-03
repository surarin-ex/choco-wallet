"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monacoin_1 = require("../../../classes/monacoin");
var chai_1 = require("chai");
describe("Monacoin のユニットテスト", function () {
    var monacoin;
    before("インスタンス作成", function () {
        monacoin = new monacoin_1.default("むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん");
    });
    describe("getPath() のユニットテスト", function () {
        it("おつりフラグ0、アドレスインデックス0で適切な値を取得できる", function () {
            var path = monacoin.getPath(0, 0);
            chai_1.assert.deepEqual(path, "m/49'/22'/0'/0/0");
        });
        it("おつりフラグ1、アドレスインデックス100で適切な値を取得できる", function () {
            var path = monacoin.getPath(1, 100);
            chai_1.assert.deepEqual(path, "m/49'/22'/0'/1/100");
        });
    });
    describe("getPaths() のユニットテスト", function () {
        it("おつりフラグ0、アドレスインデックス0、長さ3で適切な値を取得できる", function () {
            var paths = monacoin.getPaths(0, 0, 3);
            chai_1.assert.deepEqual(paths[0], "m/49'/22'/0'/0/0");
            chai_1.assert.deepEqual(paths[1], "m/49'/22'/0'/0/1");
            chai_1.assert.deepEqual(paths[2], "m/49'/22'/0'/0/2");
        });
        it("おつりフラグ1、アドレスインデックス100、長さ3で適切な値を取得できる", function () {
            var paths = monacoin.getPaths(1, 100, 3);
            chai_1.assert.deepEqual(paths[0], "m/49'/22'/0'/1/100");
            chai_1.assert.deepEqual(paths[1], "m/49'/22'/0'/1/101");
            chai_1.assert.deepEqual(paths[2], "m/49'/22'/0'/1/102");
        });
    });
    describe("getAddress() のユニットテスト", function () {
        it("正しいアドレスが生成される", function () {
            var path1 = monacoin.getPath(0, 0);
            var address1 = monacoin.getAddress(path1);
            var path2 = monacoin.getPath(0, 1);
            var address2 = monacoin.getAddress(path2);
            chai_1.assert.deepEqual(address1, "PWimVa6tr6BaUX85ukxvuV1A8E5EnRpSqX");
            chai_1.assert.deepEqual(address2, "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
        });
        it("英語のMnemonicからも正しいアドレスが生成される", function () {
            var monacoin2 = new monacoin_1.default("trend pledge shrug defense country task gain library mad fold plastic shock");
            var path1 = monacoin2.getPath(0, 0);
            var address1 = monacoin2.getAddress(path1);
            var path2 = monacoin2.getPath(0, 1);
            var address2 = monacoin2.getAddress(path2);
            chai_1.assert.deepEqual(address1, "PAuEJKctkDGaovTDXDVENLCJ1ARKeQcwT6");
            chai_1.assert.deepEqual(address2, "PXiG48h62iGfaDWdMez4JkYgJHFB8hP7pb");
        });
    });
    describe("getAddresses() のユニットテスト", function () {
        it("複数の正しいアドレスが生成される", function () {
            var paths = monacoin.getPaths(0, 0, 2);
            var addresses = monacoin.getAddresses(paths);
            chai_1.assert.deepEqual(addresses[0], "PWimVa6tr6BaUX85ukxvuV1A8E5EnRpSqX");
            chai_1.assert.deepEqual(addresses[1], "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
        });
        it("長さ1のとき、正しいアドレスが1つ入った配列が生成される", function () {
            var paths = monacoin.getPaths(0, 1, 1);
            var addresses = monacoin.getAddresses(paths);
            chai_1.assert.deepEqual(addresses[0], "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
        });
        it("長さ0のとき、空の配列が生成される", function () {
            var paths = monacoin.getPaths(0, 0, 0);
            var addresses = monacoin.getAddresses(paths);
            chai_1.assert.deepEqual(addresses, []);
        });
    });
});
