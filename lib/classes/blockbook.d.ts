export interface BlockbookAddress {
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
export interface BlockbookTx {
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
    explorer: string;
    coin: "Monacoin" | "Monacoin Testnet";
    chain: "main" | "test";
    private _socket;
    private socketUrl;
    init(chain?: string, coin?: string): Promise<boolean>;
    /**
     * アドレス情報を取得するメソッド
     * @param address アドレス
     */
    getBlockbookAddress(address: string): Promise<BlockbookAddress>;
    /**
     * 複数のアドレス情報を取得するメソッド
     * @param addresses アドレスリスト
     */
    getBlockbookAddresses(addresses: string[]): Promise<BlockbookAddress[]>;
    /**
     * トランザクション情報を取得するメソッド
     * @param txid トランザクション ID
     */
    getBlockbookTx(txid: string): Promise<BlockbookTx>;
    /**
     * 複数のトランザクション情報を取得するメソッド
     * @param txids トランザクション IDの配列
     */
    getBlockbookTxs(txids: string[]): Promise<BlockbookTx[]>;
    /**
     * 手数料のレートを数値の文字列で取得する。単位は MONA/kB。
     * APIのバージョンがv1なので、注意が必要
     * @param numberOfBlocks トランザクションが承認されるまでに許容するブロック数
     */
    estimateBlockbookFeeRate(numberOfBlocks: number): Promise<string>;
    /**
     * txをブロードキャストするメソッド
     * @param txHex ブロードキャストするtxの16進数データ
     */
    broadcastTx(txHex: string): Promise<string>;
    /**
     * BlockbookサーバーへSocket接続する
     * @param callback: コールバック関数
     */
    connect(callback?: Function): Promise<void>;
    /**
     * Socketを切断する
     */
    disconnect(): void;
    /**
     * Socket接続が切断された場合のフォールバック処理を登録する
     * @param callback コールバック関数
     */
    registerFallback(callback: Function): void;
    /**
     * 指定したアドレスに関連するTXIDを購読する
     * @param addresses アドレスリスト
     * @param callback コールバック関数
     */
    subscribeAddressTxid(addresses: string[], callback?: Function): Promise<void>;
    /**
     * subscribeAddressTxid時のリスナーを定義する
     * @param callback コールバック関数
     */
    addSubscribeAddressTxidListener(callback: (options: {
        address: string;
        txid: string;
    }) => void): void;
}
/**
 * Blockbookのクラスをインスタンス化する関数
 * @param chain チェーンの指定 "main" or "test"
 * @param coin コインの指定 "Monacoin"
 */
declare const createBlockbook: (chain?: "main" | "test", coin?: "Monacoin") => Promise<Blockbook>;
export default createBlockbook;
