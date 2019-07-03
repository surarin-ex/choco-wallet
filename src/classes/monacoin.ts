// ライブラリの読み込み
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { BIP32Interface } from "bip32";
import * as bclib from "bitcoinjs-lib";

// Monacoinのパラメータ設定(version prefix: Base58Checkエンコード時に頭に付加する文字列)
// Monacoin本家のソースコードと同じパラメータを使用すること (https://github.com/monacoinproject/monacoin/blob/master-0.17/src/chainparams.cpp)
const MONACOIN = {
  wif: 176,
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  messagePrefix: "Monacoin Signed Message:\n",
  bech32: "mona",
  pubKeyHash: 50, // M
  scriptHash: 55 // P
};

const pathBase = "m/49'/22'/0'";

/**
 * Monacoinのクラス
 */
export default class Monacoin {
  private _seed: Buffer;
  private _node: BIP32Interface;
  public constructor(mnemonic) {
    this._seed = bip39.mnemonicToSeed(mnemonic);
    this._node = bip32.fromSeed(this._seed, MONACOIN); // Monacoinのパラメータを指定
  }

  /**
   * おつりフラグとアドレスインデックスを指定してbip32のpathを取得する
   * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
   * @param addressIndex アドレスのインデックス 0からカウントアップしていく
   */
  public getPath(changeFlag: 0 | 1, addressIndex: number): string {
    return `${pathBase}/${changeFlag}/${addressIndex}`;
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
      addresses.push(`${pathBase}/${changeFlag}/${addressIndex + i}`);
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
        network: MONACOIN
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
}
