import { TxInfo } from "..";
/**
 * 指定したアドレスを監視するクラス
 */
export default class Monitor {
    readonly coin: "Monacoin";
    readonly chain: "main" | "test";
    private _blockbook;
    private _addresses;
    private _callback;
    /**
     * 初期化
     * @param coin コイン名
     * @param chain "main" or "test"
     */
    constructor(coin?: "Monacoin", chain?: "main" | "test");
    /**
     * 初期化処理
     * Blockbookオブジェクトを生成して、Socket接続する
     * また、切断時のフォールバック処理を定義する
     */
    init(): Promise<void>;
    /**
     * 監視処理の破棄。
     * 監視中のアドレスリストは破棄しない
     */
    destroy(): void;
    /**
     * アドレスリストを監視対象に追加する
     * すでに監視中のアドレスはBlockbook側で無視されるので考慮しない
     * @param addresses アドレスリスト
     */
    addAddresses(addresses: string[]): Promise<void>;
    /**
     * アドレスリストを洗い替えするメソッド
     * Blockbookへの再接続をするので多少時間がかかる
     * @param addresses アドレスリスト
     */
    replaceAddresses(addresses: string[]): Promise<void>;
    /**
     * 監視中のアドレスに紐づくTXIDを受信したときの処理をセットするメソッド
     * @param callback コールバック関数
     */
    setListener(callback: (address: string, tx: TxInfo) => void): void;
    /**
     * アドレスリストを取得する
     * 値渡しなので取得した内容を更新しても何も変化はない
     */
    getAddresses(): string[];
}
