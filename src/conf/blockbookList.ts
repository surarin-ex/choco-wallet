const endpointList = [
  {
    uri: "https://blockbook.electrum-mona.org/api/",
    explorer: "https://blockbook.electrum-mona.org/tx/",
    socket: "wss://blockbook.electrum-mona.org",
    chain: "main",
    coin: "Monacoin"
  },
  {
    uri: "https://blockbook.monacoin.cloud/api/",
    explorer: "https://blockbook.monacoin.cloud/tx/",
    socket: "wss://blockbook.monacoin.cloud",
    chain: "main",
    coin: "Monacoin"
  },
  {
    uri: "https://testnet-blockbook.electrum-mona.org/api/",
    explorer: "https://testnet-blockbook.electrum-mona.org/tx/",
    socket: "wss://testnet-blockbook.electrum-mona.org",
    chain: "test",
    coin: "Monacoin Testnet"
  }
];

export default endpointList;
