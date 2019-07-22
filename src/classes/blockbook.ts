import endpointList from "../conf/blockbookList";
import axios from "axios";

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
  txids?: string[]; // txs === 0 のときに省略される
}

export interface TxInfo {
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
  public coin: "Monacoin" | "Monacoin Testnet";
  public chain: "main" | "test";

  public async init(chain = "main", coin = "Monacoin"): Promise<void> {
    let initialIndex = Math.floor(Math.random() * endpointList.length);
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
  public async getAddressInfo(address: string): Promise<AddressInfo> {
    try {
      const uri = `${this.endpoint}/v2/address/${address}`;
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
  public async getAddressInfos(addresses: string[]): Promise<AddressInfo[]> {
    try {
      const promises: Promise<AddressInfo>[] = [];
      for (let address of addresses) {
        promises.push(this.getAddressInfo(address));
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
  public async getTxInfo(txid: string): Promise<TxInfo> {
    try {
      const uri = `${this.endpoint}/v2/tx/${txid}`;
      const res = await axios.get(uri);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  public async getTxInfos(txids: string[]): Promise<TxInfo[]> {
    try {
      const promises: Promise<TxInfo>[] = [];
      for (let txid of txids) {
        promises.push(this.getTxInfo(txid));
      }
      const txInfos = await Promise.all(promises);
      return txInfos;
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
