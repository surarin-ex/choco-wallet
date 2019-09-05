"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var endpointList = [
    {
        uri: "https://blockbook.electrum-mona.org/api/",
        chain: "main",
        coin: "Monacoin"
    },
    // {
    //   uri: "https://blockbook.monacoin.cloud/api/",
    //   chain: "main",
    //   coin: "Monacoin"
    // },
    {
        uri: "https://testnet-blockbook.electrum-mona.org/api/",
        chain: "test",
        coin: "Monacoin Testnet"
    }
];
exports.default = endpointList;
