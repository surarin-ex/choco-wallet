import endpointList from "../conf/blockbookList";
import axios from "axios";

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
  txids?: string[]; // txs === 0 のときに省略される
}

export interface BlockbookTx {
  txid: string;
  version: number;
  lockTime: number;
  vin: {
    txid: string;
    vout?: number; // vout === 0 のときに省略される
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
export class Blockbook {
  public endpoint: string;
  public explorer: string;
  public coin: "Monacoin" | "Monacoin Testnet";
  public chain: "main" | "test";

  public async init(chain = "main", coin = "Monacoin"): Promise<void> {
    const initialIndex = Math.floor(Math.random() * endpointList.length);
    let endpoint: string;
    const list = endpointList.filter(
      (blockbook: { uri: string; chain: string; coin: string }): boolean => {
        return blockbook.chain === chain && blockbook.coin === coin;
      }
    );
    for (let i = initialIndex; i < initialIndex + list.length; i++) {
      endpoint = list[i % list.length].uri;
      try {
        const res = await axios.get(endpoint);
        if (res.data.blockbook.coin !== coin)
          throw new Error(`Invalid coin: ${res.data.blockbook.coin}`);
        if (res.data.backend.chain !== chain)
          throw new Error(`Invalid chain: ${res.data.backend.chain}`);
        if (res.data.blockbook.inSync === false)
          throw new Error("Not syncing chain");
        if (res.data.blockbook.inSyncMempool === false)
          throw new Error("Not syncing mempool");
        this.endpoint = endpoint;
        this.explorer = list[i % list.length].explorer;
        this.coin = res.data.blockbook.coin;
        this.chain = res.data.backend.chain;
        break;
      } catch (err) {
        if (i === initialIndex + endpointList.length - 1) {
          throw err;
        }
        continue;
      }
    }
  }

  /**
   * アドレス情報を取得するメソッド
   * @param address アドレス
   */
  public async getBlockbookAddress(address: string): Promise<BlockbookAddress> {
    try {
      const uri = `${this.endpoint}v2/address/${address}`;
      const res = await axios.get(uri);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 複数のアドレス情報を取得するメソッド
   * @param addresses アドレスリスト
   */
  public async getBlockbookAddresses(
    addresses: string[]
  ): Promise<BlockbookAddress[]> {
    try {
      const promises: Promise<BlockbookAddress>[] = [];
      for (const address of addresses) {
        promises.push(this.getBlockbookAddress(address));
      }
      const addressInfos = await Promise.all(promises);
      return addressInfos;
    } catch (err) {
      throw err;
    }
  }

  /**
   * トランザクション情報を取得するメソッド
   * @param txid トランザクション ID
   */
  public async getBlockbookTx(txid: string): Promise<BlockbookTx> {
    try {
      const uri = `${this.endpoint}v2/tx/${txid}`;
      const res = await axios.get(uri);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 複数のトランザクション情報を取得するメソッド
   * @param txids トランザクション IDの配列
   */
  public async getBlockbookTxs(txids: string[]): Promise<BlockbookTx[]> {
    try {
      const promises: Promise<BlockbookTx>[] = [];
      for (const txid of txids) {
        promises.push(this.getBlockbookTx(txid));
      }
      const txInfos = await Promise.all(promises);
      return txInfos;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 手数料のレートを数値の文字列で取得する。単位は MONA/kB。
   * APIのバージョンがv1なので、注意が必要
   * @param numberOfBlocks トランザクションが承認されるまでに許容するブロック数
   */
  public async estimateBlockbookFeeRate(
    numberOfBlocks: number
  ): Promise<string> {
    try {
      const uri = `${this.endpoint}v1/estimatefee/${numberOfBlocks}`;
      const res = await axios.get(uri);
      return res.data.result;
    } catch (err) {
      throw err;
    }
  }

  /**
   * txをブロードキャストするメソッド
   * @param txHex ブロードキャストするtxの16進数データ
   */
  public async broadcastTx(txHex: string): Promise<string> {
    try {
      const uri = `${this.endpoint}v2/sendtx/${txHex}`;
      const res = await axios.get(uri);
      return res.data.result;
    } catch (err) {
      throw err;
    }
  }
}

/**
 * Blockbookのクラスをインスタンス化する関数
 * @param chain チェーンの指定 "main" or "test"
 * @param coin コインの指定 "Monacoin"
 */
const createBlockbook = async (
  chain: "main" | "test" = "main",
  coin: "Monacoin" = "Monacoin"
): Promise<Blockbook> => {
  const obj = new Blockbook();
  let coinName: string;
  if (chain === "main") {
    coinName = coin;
  } else {
    coinName = `${coin} Testnet`;
  }

  await obj.init(chain, coinName);
  return obj;
};

export default createBlockbook;
