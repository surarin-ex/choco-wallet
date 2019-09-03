"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 配列をシャッフルする関数。もともとの配列に対しては影響を与えない
 * @param arr 配列
 */
var shuffleArray = function (arr) {
    var _a;
    var target = Array.from(arr);
    for (var i = target.length - 1; i >= 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        _a = [target[rand], target[i]], target[i] = _a[0], target[rand] = _a[1];
    }
    return target;
};
exports.default = shuffleArray;
