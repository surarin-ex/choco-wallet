// BIP32のパスのベース部分を取得する関数
const pathBase = {
  Monacoin: {
    main: "m/49'/22'/0'",
    test: "m/49'/1'/0'"
  }
};

/**
 * BIP32のパスのベース部分を取得する関数
 * @param coin "Monacoin"
 * @param chain "main" or "test"
 */
const getPathBase = (coin: "Monacoin", chain: "main" | "test"): string => {
  return pathBase[coin][chain];
};

export default getPathBase;
