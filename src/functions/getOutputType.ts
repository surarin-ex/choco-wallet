import * as bclib from "bitcoinjs-lib";

/**
 * 送金先のアドレスからアウトプットのタイプを取得するメソッド。
 * "p2pkh", "p2sh", "p2wpkh", "p2wsh"のいずれかが得られる。
 * 識別できない場合はエラーをthrowする。
 * @param toAddress 送金先のアドレス
 */
const getOutputType = (
  toAddress: string,
  network: {
    wif: number;
    bip32: {
      public: number;
      private: number;
    };
    messagePrefix: string;
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
  }
): string => {
  const outputTypes = ["p2pkh", "p2sh", "p2wpkh", "p2wsh"];
  let returnType: string;
  outputTypes.forEach(
    (type): void => {
      try {
        bclib.payments[type]({ address: toAddress, network });
        returnType = type;
        return;
      } catch (ignoredErr) {
        // 何もしない
      }
    }
  );
  if (!returnType) throw new Error("アドレスに誤りがあります");
  return returnType;
};

export default getOutputType;
