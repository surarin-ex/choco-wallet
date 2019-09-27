import createBlockbook, { Blockbook } from "./blockbook";

/**
 * 指定したアドレスを監視するクラス
 */
export default class Monitor {
  public readonly coin: "Monacoin";
  public readonly chain: "main" | "test";
  private _blockbook: Blockbook;
  private _addresses: string[];
  private _callback: (options: { address: string; txid: string }) => void;

  /**
   * 初期化
   * @param coin コイン名
   * @param chain "main" or "test"
   */
  public constructor(
    coin: "Monacoin" = "Monacoin",
    chain: "main" | "test" = "main"
  ) {
    this.coin = coin;
    this.chain = chain;
    this._addresses = [];
    this._callback = null;
  }

  /**
   * 初期化処理
   * Blockbookオブジェクトを生成して、Socket接続する
   * また、切断時のフォールバック処理を定義する
   */
  public async init(): Promise<void> {
    this._blockbook = await createBlockbook(this.chain, this.coin);
    await this._blockbook.connect();
    this._blockbook.registerFallback(async () => {
      this.destroy();
      await this.init();
      if (this._addresses.length > 0) {
        await this.addAddresses(this._addresses);
      }
      if (this._callback) {
        this.setListener(this._callback);
      }
    });
  }

  /**
   * 監視処理の破棄。
   * 監視中のアドレスリストは破棄しない
   */
  public destroy(): void {
    if (this._blockbook) {
      this._blockbook.disconnect();
    }
    this._blockbook = null;
  }

  /**
   * アドレスリストを監視対象に追加する
   * すでに監視中のアドレスはBlockbook側で無視されるので考慮しない
   * @param addresses アドレスリスト
   */
  public async addAddresses(addresses: string[]): Promise<void> {
    const tmp = [...this._addresses, ...addresses];
    this._addresses = tmp.filter((address, i, self) => {
      return self.indexOf(address) === i;
    });
    await this._blockbook.subscribeAddressTxid(addresses);
  }

  /**
   * アドレスリストを洗い替えするメソッド
   * Blockbookへの再接続をするので多少時間がかかる
   * @param addresses アドレスリスト
   */
  public async replaceAddresses(addresses: string[]): Promise<void> {
    this._addresses = [];
    this.destroy();
    await this.init();
    await this.addAddresses(addresses);
    this.setListener(this._callback);
  }

  /**
   * 監視中のアドレスに紐づくTXIDを受信したときの処理をセットするメソッド
   * @param callback コールバック関数
   */
  public setListener(
    callback: (options: { address: string; txid: string }) => void
  ): void {
    this._callback = callback;
    this._blockbook.addSubscribeAddressTxidListener(callback);
  }

  /**
   * アドレスリストを取得する
   * 値渡しなので取得した内容を更新しても何も変化はない
   */
  public getAddresses(): string[] {
    return this._addresses.slice();
  }
}
