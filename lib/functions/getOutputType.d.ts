/**
 * 送金先のアドレスからアウトプットのタイプを取得するメソッド。
 * "p2pkh", "p2sh", "p2wpkh", "p2wsh"のいずれかが得られる。
 * 識別できない場合はエラーをthrowする。
 * @param toAddress 送金先のアドレス
 */
declare const getOutputType: (toAddress: string, network: {
    wif: number;
    bip32: {
        public: number;
        private: number;
    };
    messagePrefix: string;
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
}) => string;
export default getOutputType;
