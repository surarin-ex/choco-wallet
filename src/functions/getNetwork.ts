// Monacoinのパラメータ設定(version prefix: Base58Checkエンコード時に頭に付加する文字列)
// Monacoin本家のソースコードと同じパラメータを使用すること (https://github.com/monacoinproject/monacoin/blob/master-0.17/src/chainparams.cpp)
const network = {
  Monacoin: {
    main: {
      wif: 176,
      bip32: {
        public: 77429938,
        private: 76066276
      },
      messagePrefix: "Monacoin Signed Message:\n",
      bech32: "mona",
      pubKeyHash: 50, // M
      scriptHash: 55 // P
    },
    test: {
      messagePrefix: "Monacoin Signed Message:\n",
      bip32: {
        public: 70617039, // 間違っている可能性がある※正しい値が不明
        private: 70615956
      },
      pubKeyHash: 111, // m
      scriptHash: 117, // p
      wif: 239,
      bech32: "tmona"
    }
  }
};

const getNetwork = (
  coin: "Monacoin",
  chain: "main" | "test"
): {
  wif: number;
  bip32: {
    public: number;
    private: number;
  };
  messagePrefix: string;
  bech32: string;
  pubKeyHash: number;
  scriptHash: number;
} => {
  return network[coin][chain];
};

export default getNetwork;
