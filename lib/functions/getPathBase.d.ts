/**
 * BIP32のパスのベース部分を取得する関数
 * @param coin "Monacoin"
 * @param chain "main" or "test"
 */
declare const getPathBase: (coin: "Monacoin", chain: "main" | "test") => string;
export default getPathBase;
