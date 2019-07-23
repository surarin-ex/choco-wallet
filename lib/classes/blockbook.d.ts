export interface AddressInfo {
    page: number;
    totalPages: number;
    itemsOnPage: number;
    address: string;
    balance: string;
    totalReceived: string;
    totalSent: string;
    unconfirmedBalance: string;
    unconfirmedTxs: number;
    txs: number;
    txids?: string[];
}
export interface TxInfo {
    txid: string;
    version: number;
    lockTime: number;
    vin: {
        txid: string;
        vout?: number;
        sequence: number;
        n: number;
        addresses: string[];
        isAddress: boolean;
        value: string;
        hex: string;
    }[];
    vout: {
        value: string;
        n: number;
        hex: string;
        addresses: string[];
        isAddress: boolean;
    }[];
    blockHash: string;
    blockHeight: number;
    confirmations: number;
    blockTime: number;
    value: string;
    valueIn: string;
    fees: string;
    hex: string;
}
/**
 * Blockbook クラス
 */
export declare class Blockbook {
    endpoint: string;
    coin: "Monacoin" | "Monacoin Testnet";
    chain: "main" | "test";
    init(chain?: string, coin?: string): Promise<void>;
    /**
     * アドレス情報を取得するメソッド
     * @param address アドレス
     */
    getAddressInfo(address: string): Promise<AddressInfo>;
    /**
     * 複数のアドレス情報を取得するメソッド
     * @param addresses アドレスリスト
     */
    getAddressInfos(addresses: string[]): Promise<AddressInfo[]>;
    /**
     * トランザクション情報を取得するメソッド
     * @param txid トランザクション ID
     */
    getTxInfo(txid: string): Promise<TxInfo>;
    /**
     * 複数のトランザクション情報を取得するメソッド
     * @param txids トランザクション IDの配列
     */
    getTxInfos(txids: string[]): Promise<TxInfo[]>;
}
/**
 * Blockbookのクラスをインスタンス化する関数
 * @param chain チェーンの指定 "main" or "test"
 * @param coin コインの指定 "Monacoin"
 */
declare const createBlockbook: (chain?: "main" | "test", coin?: "Monacoin") => Promise<Blockbook>;
export default createBlockbook;
