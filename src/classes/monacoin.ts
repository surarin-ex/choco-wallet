// ライブラリの読み込み
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { BIP32Interface } from "bip32";
import * as bclib from "bitcoinjs-lib";
import createBlockbook, { BlockbookAddress } from "./blockbook";
import { Blockbook } from "../../src/classes/blockbook";
import BigNumber from "bignumber.js";

// Monacoinのパラメータ設定(version prefix: Base58Checkエンコード時に頭に付加する文字列)
// Monacoin本家のソースコードと同じパラメータを使用すること (https://github.com/monacoinproject/monacoin/blob/master-0.17/src/chainparams.cpp)
const MONACOIN = {
  wif: 176,
  bip32: {
    public: 77429938,
    private: 76066276
  },
  messagePrefix: "Monacoin Signed Message:\n",
  bech32: "mona",
  pubKeyHash: 50, // M
  scriptHash: 55 // P
};
// Monacoin-Testnetのパラメータ設定
const MONACOIN_TESTNET = {
  messagePrefix: "Monacoin Signed Message:\n",
  bip32: {
    public: 70617039, // 間違っている可能性がある※正しい値が不明
    private: 70615956
  },
  pubKeyHash: 111, // m
  scriptHash: 117, // p
  wif: 239,
  bech32: "tmona"
};
const pathBase = "m/49'/22'/0'";
const pathBase_test = "m/49'/1'/0'";
const GAP_LIMIT_RECEIVING = 10; // 未使用受取アドレスの余裕数
const GAP_LIMIT_CHANGE = 3; // 未使用おつりアドレスの余裕数

export interface AddressInfo {
  address: string;
  path: string;
  isSpent: boolean;
  isChange: boolean;
  index: number;
  balance: string;
  unconfirmedBalance: string;
  txids?: string[];
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
 * Monacoinのクラス
 */
export default class Monacoin {
  public blockbook: Blockbook;
  public addressInfos: AddressInfo[];
  public txInfos: TxInfo[];
  public balance: string;
  public balanceReadable: string;
  public readonly displayUnit: string;
  public readonly balanceUnit: string;
  private _seed: Buffer;
  private _node: BIP32Interface;
  private _chain: "main" | "test";
  private _coin: "Monacoin";
  private _network: {
    wif: number;
    bip32: {
      public: number;
      private: number;
    };
    messagePrefix: string;
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
  };
  private _pathBase: string;
  public constructor(mnemonic: string, chain: "main" | "test" = "main") {
    this.blockbook = null;
    this.addressInfos = [];
    this.balance = "0";
    this.displayUnit = "MONA";
    this.balanceUnit = "WATANABE";
    this._seed = bip39.mnemonicToSeed(mnemonic);
    this._node = bip32.fromSeed(this._seed, MONACOIN); // Monacoinのパラメータを指定
    this._chain = chain;
    this._coin = "Monacoin";
    this._network = chain === "main" ? MONACOIN : MONACOIN_TESTNET;
    this._pathBase = chain === "main" ? pathBase : pathBase_test;
  }

  /**
   * おつりフラグとアドレスインデックスを指定してbip32のpathを取得する
   * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
   * @param addressIndex アドレスのインデックス 0からカウントアップしていく
   */
  public getPath(changeFlag: 0 | 1, addressIndex: number): string {
    return `${this._pathBase}/${changeFlag}/${addressIndex}`;
  }

  /**
   * スタート位置のおつりフラグとアドレスインデックスを指定し、長さを指定することで、指定した長さのbip32のpath配列を取得する
   * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
   * @param addressIndex アドレスのインデックス 0からカウントアップしていく
   * @param length 長さ、10を指定するとaddressIndex〜addressIndex+9までの10要素の配列が取得できる
   */
  public getPaths(
    changeFlag: 0 | 1,
    addressIndex: number,
    length: number
  ): string[] {
    const addresses = [];
    for (let i = 0; i < length; i++) {
      addresses.push(`${this._pathBase}/${changeFlag}/${addressIndex + i}`);
    }
    return addresses;
  }

  /**
   * bip32のpathを指定してアドレスを取得する
   * @param path bip32のpath
   */
  public getAddress(path: string): string {
    const child = this._node.derivePath(path);
    const address = bclib.payments.p2sh({
      redeem: bclib.payments.p2wpkh({
        pubkey: child.publicKey,
        network: this._network
      })
    }).address;
    return address;
  }

  /**
   * pathの配列に対応するアドレスの配列を取得する
   * @param paths pathの配列
   */
  public getAddresses(paths: string[]): string[] {
    const addresses = paths.map(
      (path: string): string => {
        return this.getAddress(path);
      }
    );
    return addresses;
  }

  /**
   * 未使用アドレス連続数を取得するメソッド
   * @param addressInfos アドレス情報の配列
   * @param startSequence 未使用アドレス連続数の初期値
   */
  private _getUnspentAddressSequence(
    addressInfos: BlockbookAddress[],
    startSequence: number
  ): number {
    let unspentSequence = startSequence;
    addressInfos.forEach(
      (info): void => {
        unspentSequence++;
        if (info.txs > 0) unspentSequence = 0;
      }
    );
    return unspentSequence;
  }

  /**
   * アドレスの種類・個数を指定して、パスとアドレス情報を取得し、返り値としてそれらを詰め込んだオブジェクトと未使用アドレスの連続数を出力するメソッド。
   * gap limit を補償するために使用する未使用アドレスの連続数を計算して返り値として返す。
   * @type {object} allAddressData - アドレス情報とそのパスをまとめたオブジェクト
   * @property {string[]} allPaths パスの配列
   * @property {BlockbookAddress[]} allBlockbookAddresses blockbookから取得するアドレス情報の格納先
   * @type {object} options 引数のオブジェクト
   * @property {object} blockbook Blockbookオブジェクト
   * @property {object} allAddressData アドレス情報とパスをまとめたオブジェクト
   * @property {0 | 1} isChange おつりフラグ
   * @property {number} startIndex 取得するアドレスの最初のインデックス
   * @property {number} length 取得するアドレスの個数
   * @property {number} startSequence 未使用アドレスの連続数の初期値
   * @return {object} 全アドレス情報と未使用アドレスの連続数
   * @property {object} allAddressData 元のアドレス情報と取得した全アドレス情報をマージしたオブジェクト
   * @property {number} unspentSequence 未使用アドレスの連続数
   */
  private async _getAddressData(options: {
    allAddressData: {
      allPaths: string[];
      allBlockbookAddresses: BlockbookAddress[];
    };
    isChange: 0 | 1;
    startIndex: number;
    length: number;
    startSequence: number;
  }): Promise<{
    allAddressData: {
      allPaths: string[];
      allBlockbookAddresses: BlockbookAddress[];
    };
    unspentSequence: number;
  }> {
    try {
      const allAddressData = Object.assign({}, options.allAddressData);
      const paths = this.getPaths(
        options.isChange,
        options.startIndex,
        options.length
      );
      const addresses = this.getAddresses(paths);
      const addressInfos = await this.blockbook.getBlockbookAddresses(
        addresses
      );
      const unspentSequence = this._getUnspentAddressSequence(
        addressInfos,
        options.startSequence
      );
      paths.forEach(
        (path: string): void => {
          allAddressData.allPaths.push(path);
        }
      );
      addressInfos.forEach(
        (info: BlockbookAddress): void => {
          allAddressData.allBlockbookAddresses.push(info);
        }
      );
      return { allAddressData, unspentSequence };
    } catch (err) {
      throw err;
    }
  }

  /**
   * プロパティのアドレス情報の配列から、承認済み残高と未承認残高の合計値を計算して文字列形式で出力するメソッド。
   * updateAddressInfos()が未実行の場合"0"を返す
   */
  private _updateBalance(): void {
    const balance = this.addressInfos.reduce((sum, info): string => {
      const sumNum = new BigNumber(sum)
        .plus(info.balance)
        .plus(info.unconfirmedBalance);
      return sumNum.toString();
    }, "0");
    this.balance = balance;
    this.balanceReadable = new BigNumber(balance)
      .dividedBy(100000000)
      .toString();
  }

  /**
   * GAP_LIMITまでの全アドレス情報を取得するメソッド。
   * 取得したアドレス情報はインスタンスのプロパティに格納され、返り値としても渡される
   * @type {object} options 引数のオブジェクト
   * @property {number} receivingAddressNum 最低限取得する受取アドレスの個数
   * @property {number} changeAddressNum 最低限取得するおつりアドレスの個数
   * @param options 引数のオブジェクト
   */
  public async updateAddressInfos(
    options: {
      receivingAddressNum: number;
      changeAddressNum: number;
    } = {
      receivingAddressNum: GAP_LIMIT_RECEIVING,
      changeAddressNum: GAP_LIMIT_CHANGE
    }
  ): Promise<void> {
    this.blockbook = await createBlockbook(this._chain, this._coin);
    let allAddressData: {
      allPaths: string[];
      allBlockbookAddresses: BlockbookAddress[];
    } = {
      allPaths: [],
      allBlockbookAddresses: []
    };

    // 受取アドレスの情報取得
    let unspentSequence: number;
    ({ allAddressData, unspentSequence } = await this._getAddressData({
      allAddressData,
      isChange: 0,
      startIndex: 0,
      length: options.receivingAddressNum,
      startSequence: 0
    }));

    let nextIndex = options.receivingAddressNum;
    while (unspentSequence < GAP_LIMIT_RECEIVING) {
      const length = Math.max(GAP_LIMIT_RECEIVING - unspentSequence, 0);
      ({ allAddressData, unspentSequence } = await this._getAddressData({
        allAddressData,
        isChange: 0,
        startIndex: nextIndex,
        length,
        startSequence: unspentSequence
      }));
      nextIndex += length;
    }

    // おつりアドレスの情報取得
    ({ allAddressData, unspentSequence } = await this._getAddressData({
      allAddressData,
      isChange: 1,
      startIndex: 0,
      length: options.changeAddressNum,
      startSequence: 0
    }));
    nextIndex = options.changeAddressNum;
    while (unspentSequence < GAP_LIMIT_CHANGE) {
      const length = Math.max(GAP_LIMIT_CHANGE - unspentSequence, 0);
      ({ allAddressData, unspentSequence } = await this._getAddressData({
        allAddressData,
        isChange: 1,
        startIndex: nextIndex,
        length,
        startSequence: unspentSequence
      }));
      nextIndex += length;
    }

    // アドレス情報の整理
    const addressInfos: AddressInfo[] = [];
    allAddressData.allBlockbookAddresses.forEach(
      (info, index): void => {
        addressInfos.push({
          address: info.address,
          path: allAddressData.allPaths[index],
          isSpent: info.txs > 0 ? true : false,
          isChange:
            allAddressData.allPaths[index].split("/")[4] === "1" ? true : false,
          index: parseInt(allAddressData.allPaths[index].split("/")[5]),
          balance: info.balance,
          unconfirmedBalance: info.unconfirmedBalance,
          txids: info.txids
        });
      }
    );
    this.addressInfos = addressInfos;
    this._updateBalance();
  }

  /**
   * トランザクション情報をBlockbookから取得して、プロパティのtxInfosを更新するメソッド
   */
  public async updateTxInfos(): Promise<void> {
    if (this.addressInfos.length === 0) {
      await this.updateAddressInfos();
    }
    // 重複を除去したtxidの配列を取得
    let dupTxids = [];
    this.addressInfos.forEach(
      (info): void => {
        if (info.txids) {
          dupTxids = dupTxids.concat(info.txids);
        }
      }
    );
    const txids = dupTxids.filter(
      (address, index, addresses): boolean => {
        return addresses.indexOf(address) === index;
      }
    );
    this.txInfos = await this.blockbook.getBlockbookTxs(txids);
  }
}
