// ライブラリの読み込み
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { BIP32Interface } from "bip32";
import * as bclib from "bitcoinjs-lib";
import createBlockbook, { BlockbookAddress } from "./blockbook";
import { Blockbook } from "../../src/classes/blockbook";
import BigNumber from "bignumber.js";
import {
  WitnessUtxo,
  TransactionInput,
  PsbtInput,
  PsbtOutput,
  TransactionOutput
} from "bip174/src/lib/interfaces";
import estimateTxBytes from "../functions/estimateTxBytes";
import getNetwork from "../functions/getNetwork";
import getPathBase from "../functions/getPathBase";
import getOutputType from "../functions/getOutputType";
import AddressInfo from "../interfaces/addressInfo";
import TxInfo from "../interfaces/txInfo";
import Utxo from "../interfaces/utxo";
import singleRandomDraw from "../functions/singleRandomDraw";
import getUtxosValue from "../functions/getUtxosValue";
import branchAndBound from "../functions/branchAndBound";
import TxHistory from "../interfaces/txHistory";
import * as Moment from "moment";

/**
 * Monacoinのクラス
 */
export default class Monacoin {
  public blockbook: Blockbook;
  public addressInfos: AddressInfo[];
  public txInfos: TxInfo[];
  public balance: string;
  public balanceReadable: string;
  public receiveAddress: string;
  public changeAddress: string;
  public txHistories: TxHistory[];
  public readonly displayUnit: string;
  public readonly balanceUnit: string;
  public readonly addressType: string;
  public readonly minFeeRate: number;
  public readonly minOutValue: string;
  public readonly digit: number;
  public readonly gapLimitReceiving: number;
  public readonly gapLimitChange: number;
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
  private unsignedTx: {
    psbt: bclib.Psbt;
    utxos: Utxo[];
    amount: string;
    fees: string;
    feeRate: number;
    toAddress: string;
    sumInput: string;
  };
  private signedTx: {
    psbt: bclib.Psbt;
    utxos: Utxo[];
    amount: string;
    fees: string;
    feeRate: number;
    toAddress: string;
    sumInput: string;
  };

  public constructor(mnemonic: string, chain: "main" | "test" = "main") {
    this.blockbook = null;
    this.addressInfos = [];
    this.txHistories = [];
    this.balance = "0";
    this.displayUnit = "MONA";
    this.balanceUnit = "WATANABE";
    this.addressType = "P2SH-P2WPKH";
    this.minFeeRate = 150; // watanabe / byte
    const inputs = {};
    inputs[this.addressType] = 1;
    this.minOutValue = (
      Math.min(
        estimateTxBytes(inputs, { P2PKH: 1 }),
        estimateTxBytes(inputs, { P2SH: 1 }),
        estimateTxBytes(inputs, { P2WPKH: 1 }),
        estimateTxBytes(inputs, { P2WSH: 1 })
      ) * this.minFeeRate
    ).toString(); // watanabe
    this._chain = chain;
    this._coin = "Monacoin";
    this.digit = 100000000;
    this.gapLimitReceiving = 10; // 未使用受取アドレスの余裕数
    this.gapLimitChange = 3; // 未使用おつりアドレスの余裕数
    this._network = getNetwork(this._coin, this._chain);
    this._pathBase = getPathBase(this._coin, this._chain);
    this._seed = bip39.mnemonicToSeed(mnemonic);
    this._node = bip32.fromSeed(this._seed, this._network); // Monacoinのパラメータを指定
    this.unsignedTx = null;
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
   * bip32のpathを指定してTXの作成に使用可能なPaymentオブジェクトを取得する
   * @param path bip32のpath
   */
  private _getPaymentFromPath(path: string): bclib.Payment {
    const child = this._node.derivePath(path);
    let address: bclib.Payment;
    if (this.addressType === "P2SH-P2WPKH") {
      address = bclib.payments.p2sh({
        redeem: bclib.payments.p2wpkh({
          pubkey: child.publicKey,
          network: this._network
        })
      });
    } else {
      throw new Error(`${this.addressType} is not defined.`);
    }
    return address;
  }

  /**
   * bip32のpathを指定してアドレスを取得する
   * @param path bip32のpath
   */
  public getAddress(path: string): string {
    const address = this._getPaymentFromPath(path).address;
    return address;
  }

  /**
   * pathの配列に対応するアドレスの配列を取得する
   * @param paths pathの配列
   */
  public getAddresses(paths: string[]): string[] {
    const addresses = paths.map((path: string): string => {
      return this.getAddress(path);
    });
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
    addressInfos.forEach((info): void => {
      unspentSequence++;
      if (info.txs > 0) unspentSequence = 0;
    });
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
      paths.forEach((path: string): void => {
        allAddressData.allPaths.push(path);
      });
      addressInfos.forEach((info: BlockbookAddress): void => {
        allAddressData.allBlockbookAddresses.push(info);
      });
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
      .dividedBy(this.digit)
      .toString();
  }

  /**
   * 受取用アドレスにおつりフラグが立っておらず、未使用のアドレスをセットする。
   * ※addressInfosプロパティがindexの小さい順に並んでいることを前提としている
   */
  private _setReceiveAddress(): void {
    const receiveAddressInfo = this.addressInfos.find((info): boolean => {
      return !info.isChange && !info.isSpent;
    });
    this.receiveAddress = receiveAddressInfo.address;
  }

  /**
   * おつり用アドレスにおつりフラグが立っていて、未使用のアドレスをセットする。
   * ※addressInfosプロパティがindexの小さい順に並んでいることを前提としている
   */
  private _setChangeAddress(): void {
    const changeAddressInfo = this.addressInfos.find((info): boolean => {
      return info.isChange && !info.isSpent;
    });
    this.changeAddress = changeAddressInfo.address;
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
      receivingAddressNum: this.gapLimitReceiving,
      changeAddressNum: this.gapLimitChange
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
    while (unspentSequence < this.gapLimitReceiving) {
      const length = Math.max(this.gapLimitReceiving - unspentSequence, 0);
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
    while (unspentSequence < this.gapLimitChange) {
      const length = Math.max(this.gapLimitChange - unspentSequence, 0);
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
    allAddressData.allBlockbookAddresses.forEach((info, index): void => {
      addressInfos.push({
        address: info.address,
        path: allAddressData.allPaths[index],
        isSpent: info.totalReceived !== "0" ? true : false,
        isChange:
          allAddressData.allPaths[index].split("/")[4] === "1" ? true : false,
        index: parseInt(allAddressData.allPaths[index].split("/")[5]),
        balance: info.balance,
        unconfirmedBalance: info.unconfirmedBalance,
        txids: info.txids
      });
    });
    this.addressInfos = addressInfos;
    this._updateBalance();
    this._setReceiveAddress();
    this._setChangeAddress();
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
    this.addressInfos.forEach((info): void => {
      if (info.txids) {
        dupTxids = dupTxids.concat(info.txids);
      }
    });
    const txids = dupTxids.filter((address, index, addresses): boolean => {
      return addresses.indexOf(address) === index;
    });
    this.txInfos = await this.blockbook.getBlockbookTxs(txids);
  }

  /**
   * 妥当な手数料率を数値文字列で取得する。単位は watanabe / byte。
   * 最低の手数料率は 150 watanabe / byte。
   * @param speed ブロックに取り込まれるまでの速さの指定
   */
  public async estimateFeeRate(
    speed: "fast" | "normal" | "slow" | "min"
  ): Promise<number> {
    if (!this.blockbook) {
      this.blockbook = await createBlockbook(this._chain, this._coin);
    }
    let numberOfBlocks: number;
    switch (speed) {
      case "fast":
        numberOfBlocks = 2;
        break;
      case "normal":
        numberOfBlocks = 5;
        break;
      case "slow":
        numberOfBlocks = 20;
        break;
      case "min":
        return this.minFeeRate;
      default:
        numberOfBlocks = 2;
    }
    const feeRate_MONA_kB = await this.blockbook.estimateBlockbookFeeRate(
      numberOfBlocks
    );
    const feeRate_WATANABE_B = new BigNumber(feeRate_MONA_kB).times(100000);
    const feeRate = feeRate_WATANABE_B.gt(this.minFeeRate)
      ? feeRate_WATANABE_B.toNumber()
      : this.minFeeRate;
    return feeRate;
  }

  /**
   * UTXOを取得するメソッド。
   * txInfosが未取得の場合は空配列を返す。
   * 返り値はkey-valueオブジェクトの配列で、keyは"txid:vout"、valueはwatanabe単位の金額の数値文字列
   */
  private _getUtxos(): Utxo[] {
    const spentOutputs: string[] = [];
    this.txInfos.forEach((txInfo): void => {
      txInfo.vin.forEach((input): void => {
        spentOutputs.push(`${input.txid}:${input.vout || 0}`);
      });
    });
    const utxos: Utxo[] = []; // key: "txid:vout", value: value
    this.txInfos.sort((a, b): number => {
      return b.confirmations - a.confirmations;
    });
    this.txInfos.forEach((txInfo): void => {
      txInfo.vout.forEach((output): void => {
        if (spentOutputs.indexOf(`${txInfo.txid}:${output.n}`) < 0) {
          const info = this.addressInfos.find((info): boolean => {
            return info.address === output.addresses[0];
          });
          if (info) {
            const tx = bclib.Transaction.fromHex(txInfo.hex);
            utxos.push({
              txid: txInfo.txid,
              index: output.n,
              amount: output.value,
              script: tx.outs[output.n].script.toString("hex"),
              txHex: txInfo.hex,
              path: info.path,
              confirmations: txInfo.confirmations
            });
          }
        }
      });
    });
    return utxos;
  }

  /**
   * UTXOをbitcoinjs-libのWitnessUtxoの型に変換するメソッド
   * @param utxo Utxoオブジェクト
   */
  private _getWitnessUtxo(utxo: Utxo): WitnessUtxo {
    const witnessUtxo = {
      value: parseInt(utxo.amount),
      script: Buffer.from(utxo.script, "hex")
    };
    return witnessUtxo;
  }

  /**
   * bitcoinjs-libのPaymentに追加するためのInputDataを作成するメソッド
   * @param utxo Utxoオブジェクト
   * @param payment bitcoinjs-libのPaymentオブジェクト
   * @param isSegwit Segwitか否かを表すフラグ
   * @param redeemType redeemscriptのタイプ "p2sh" "p2wsh" "p2sh-p2wsh"
   */
  private _getInputData(
    utxo: Utxo,
    payment: bclib.Payment,
    isSegwit: boolean,
    redeemType: "p2sh" | "p2wsh" | "p2sh-p2wsh"
  ): PsbtInput & TransactionInput {
    const nonWitnessUtxo = Buffer.from(utxo.txHex, "hex");
    const witnessUtxo = this._getWitnessUtxo(utxo);
    const mixin = isSegwit ? { witnessUtxo } : { nonWitnessUtxo };
    const mixin2: { redeemScript?: Buffer; witnessScript?: Buffer } = {};
    switch (redeemType) {
      case "p2sh":
        mixin2.redeemScript = payment.redeem.output;
        break;
      case "p2wsh":
        mixin2.witnessScript = payment.redeem.output;
        break;
      case "p2sh-p2wsh":
        mixin2.witnessScript = payment.redeem.redeem.output;
        mixin2.redeemScript = payment.redeem.output;
        break;
    }
    return {
      hash: Buffer.from(
        Uint8Array.from(Buffer.from(utxo.txid, "hex")).reverse()
      ),
      index: utxo.index,
      ...mixin,
      ...mixin2
    };
  }

  /**
   * PSBTに追加するためのoutputデータを作成するメソッド
   * @param toAddress 送金先のアドレス
   * @param amount 金額 watanabe単位
   */
  private _getOutputData(
    toAddress: string,
    amount: number
  ): {
    script: Buffer;
    value: number;
  } {
    const type = getOutputType(toAddress, this._network);
    const payment = bclib.payments[type]({
      address: toAddress,
      network: this._network
    });
    return {
      script: payment.output,
      value: amount
    };
  }

  /**
   * 手数料を計算する
   * @param byteCounts バイト数 vsize
   * @param feeRate 手数料率 watanabe / byte
   */
  private _computeFees(byteCounts: number, feeRate: number): string {
    const fees = new BigNumber(byteCounts).times(feeRate).toString();
    return fees;
  }

  /**
   * トランザクションの生成に必要なUTXOを選択するとともに、手数料を推定するメソッド
   * @param options 引数オブジェクト
   */
  private _selectUtxos(options: {
    utxos: Utxo[];
    feeRate: number;
    toAddress: string;
    amount: string;
    algorithm: "Single Random Draw" | "Branch and Bound";
  }): {
    utxos: Utxo[];
    fees: string;
    hasChange: boolean;
  } {
    if (options.algorithm === "Single Random Draw") {
      const result = singleRandomDraw({
        utxos: options.utxos,
        feeRate: options.feeRate,
        inputType: this.addressType,
        outputType: getOutputType(
          options.toAddress,
          this._network
        ).toUpperCase(),
        amount: options.amount,
        minOutValue: this.minOutValue
      });
      return {
        utxos: result.selectedUtxos,
        fees: result.fees,
        hasChange: result.hasChange
      };
    } else if (options.algorithm === "Branch and Bound") {
      const result = branchAndBound({
        utxos: options.utxos,
        feeRate: options.feeRate,
        inputType: this.addressType,
        outputType: getOutputType(
          options.toAddress,
          this._network
        ).toUpperCase(),
        amount: options.amount,
        minOutValue: this.minOutValue
      });
      return {
        utxos: result.selectedUtxos,
        fees: result.fees,
        hasChange: result.hasChange
      };
    }
  }

  /**
   * 未署名トランザクションを生成し、プロパティのunsignedTxにセットするメソッド
   * @param options 引数オブジェクト
   */
  public async updateUnsignedTx(options: {
    toAddress: string; // 送金先アドレス
    amount: string; //送金額 watanabe単位
    feeRate: number; // 手数料率 watanabe/Byte
  }): Promise<void> {
    const amount_big = new BigNumber(options.amount);
    if (
      amount_big.lt(this.minOutValue) ||
      !Number.isInteger(amount_big.toNumber()) ||
      amount_big.toString() === "NaN"
    ) {
      throw new Error("送金額が不適切です");
    }
    if (
      options.feeRate < this.minFeeRate ||
      !Number.isInteger(options.feeRate)
    ) {
      throw new Error("手数料のレートが不適切です");
    }
    if (!this.addressInfos) await this.updateAddressInfos();
    if (!this.txInfos) await this.updateTxInfos();
    const allUtxos = this._getUtxos();
    const { utxos, fees, hasChange } = this._selectUtxos({
      utxos: allUtxos,
      feeRate: options.feeRate,
      toAddress: options.toAddress,
      amount: options.amount,
      algorithm: "Branch and Bound"
    });
    const sumInput = getUtxosValue(utxos);
    const psbt = new bclib.Psbt({ network: this._network });
    psbt.setVersion(2);
    psbt.setLocktime(0);
    const inputDataList: (PsbtInput & TransactionInput)[] = [];
    utxos.forEach((utxo): void => {
      const payment = this._getPaymentFromPath(utxo.path);
      const inputData = this._getInputData(utxo, payment, true, "p2sh");
      inputDataList.push(inputData);
    });
    psbt.addInputs(inputDataList);
    const outputDataList: (PsbtOutput & TransactionOutput)[] = [];
    const outputData1 = this._getOutputData(
      options.toAddress,
      parseInt(options.amount)
    );
    outputDataList.push(outputData1);
    if (hasChange) {
      const changeAmount = new BigNumber(sumInput)
        .minus(new BigNumber(options.amount))
        .minus(new BigNumber(fees));
      const outputData2 = this._getOutputData(
        this.changeAddress,
        changeAmount.toNumber()
      );
      outputDataList.push(outputData2);
    }
    psbt.addOutputs(outputDataList);
    this.unsignedTx = {
      psbt,
      utxos,
      amount: options.amount,
      fees: fees,
      feeRate: options.feeRate,
      sumInput,
      toAddress: options.toAddress
    };
  }

  /**
   * 未署名トランザクションの概要を取得するメソッド
   */
  public getUnsignedTxSummary(): {
    amount: string;
    amount_mona: string;
    fees: string;
    fees_mona: string;
    sumInput: string;
    sumInput_mona: string;
    feeRate: number;
    inputCount: number;
    toAddress: string;
  } {
    return {
      amount: this.unsignedTx.amount,
      amount_mona: new BigNumber(this.unsignedTx.amount)
        .dividedBy(this.digit)
        .toString(),
      fees: this.unsignedTx.fees,
      fees_mona: new BigNumber(this.unsignedTx.fees)
        .dividedBy(this.digit)
        .toString(),
      sumInput: this.unsignedTx.sumInput,
      sumInput_mona: new BigNumber(this.unsignedTx.sumInput)
        .dividedBy(this.digit)
        .toString(),
      feeRate: this.unsignedTx.feeRate,
      inputCount: this.unsignedTx.psbt.inputCount,
      toAddress: this.unsignedTx.toAddress
    };
  }

  /**
   * 未署名トランザクションに署名するメソッド
   */
  public signTx(): void {
    try {
      // 署名
      this.unsignedTx.utxos.forEach((utxo, index): void => {
        this.unsignedTx.psbt.signInput(index, this._node.derivePath(utxo.path));
      });
      // 署名の検証
      this.unsignedTx.utxos.forEach((utxo, index): void => {
        const result = this.unsignedTx.psbt.validateSignaturesOfInput(index);
        if (!result)
          throw new Error("トランザクションの署名の検証でエラーが発生しました");
      });
      this.unsignedTx.psbt.finalizeAllInputs();
      this.signedTx = this.unsignedTx;
      this.unsignedTx = null;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 署名済みトランザクションの概要を取得する
   */
  public getSignedTxSummary(): {
    txid: string;
    byteLength: number;
    vsize: number;
    weight: number;
    amount: string;
    amount_mona: string;
    fees: string;
    fees_mona: string;
    confirmedFeeRate: number;
    configuredFeeRate: number;
    outs: {
      address: string;
      amount: string;
      amount_mona: string;
    }[];
    change: {
      address: string;
      amount: string;
      amount_mona: string;
    };
    txHex: string;
  } {
    const tx = this.signedTx.psbt.extractTransaction();
    const txHex = tx.toHex();
    const outs = tx.outs.map((out): {
      address: string;
      amount: string;
      amount_mona: string;
    } => {
      return {
        address: bclib.address.fromOutputScript(out.script, this._network),
        amount: "value" in out ? out.value.toString() : "unknown",
        amount_mona:
          "value" in out
            ? new BigNumber(out.value).dividedBy(this.digit).toString()
            : "unknown"
      };
    });
    const outsExceptChange = outs.filter((out): boolean => {
      return out.address !== this.changeAddress;
    });
    const change =
      outs.find((out): boolean => {
        return out.address === this.changeAddress;
      }) || null;
    const amount = outsExceptChange.reduce((sum, out): string => {
      return new BigNumber(sum).plus(new BigNumber(out.amount)).toString();
    }, "0");
    const amount_mona = new BigNumber(amount).dividedBy(this.digit).toString();
    return {
      txid: tx.getId(),
      byteLength: tx.byteLength(),
      vsize: tx.virtualSize(),
      weight: tx.weight(),
      amount,
      amount_mona,
      fees: this.signedTx.fees,
      fees_mona: new BigNumber(this.signedTx.fees)
        .dividedBy(this.digit)
        .toString(),
      confirmedFeeRate: this.signedTx.psbt.getFeeRate(),
      configuredFeeRate: this.signedTx.feeRate,
      outs: outsExceptChange,
      change,
      txHex
    };
  }

  /**
   * 署名済みトランザクションをnullにセットする
   */
  public deleteSignedTx(): void {
    this.signedTx = null;
  }

  /**
   * 署名済みのトランザクションブロードキャストするメソッド。
   * ブロードキャストに成功した場合txidを返し、署名済みトランザクションを破棄する
   */
  public async broadcastTx(): Promise<string> {
    if (!this.signedTx) return null;
    const result = await this.blockbook.broadcastTx(
      this.signedTx.psbt.extractTransaction().toHex()
    );
    this.deleteSignedTx();
    return result;
  }

  /**
   * トランザクション履歴を更新するメソッド
   */
  public updateHistory(): void {
    if (!this.txInfos || !this.addressInfos) return;
    const allAddresses = this.addressInfos.map((info): string => {
      return info.address;
    });
    const flatten = (arr): any[] => {
      return arr.reduce((p, c): any[] => {
        return Array.isArray(c) ? p.concat(flatten(c)) : p.concat(c);
      }, []);
    };
    const txHistories: TxHistory[] = [];
    this.txInfos.forEach((info): void => {
      const fromAddresses = flatten(
        info.vin.map((input): string[] => {
          return input.addresses;
        })
      );
      const toAddresses = flatten(
        info.vout.map((output): string[] => {
          return output.addresses;
        })
      );
      const hasMyInput = fromAddresses.some((address): boolean => {
        return allAddresses.includes(address);
      });
      const isMyInput = fromAddresses.every((address): boolean => {
        return allAddresses.includes(address);
      });
      const hasMyOutput = toAddresses.some((address): boolean => {
        return allAddresses.includes(address);
      });
      const isMyOutput = toAddresses.every((address): boolean => {
        return allAddresses.includes(address);
      });
      // 入金の場合
      if (!hasMyInput && hasMyOutput) {
        const value =
          "+" +
          info.vout
            .filter((output): boolean => {
              return output.addresses.every((address): boolean => {
                return allAddresses.includes(address);
              });
            })
            .reduce((acc, output): BigNumber => {
              return acc.plus(output.value);
            }, new BigNumber("0"))
            .dividedBy(this.digit)
            .toString();
        txHistories.push({
          txid: info.txid,
          blockTime: info.blockTime,
          time: info.blockTime
            ? Moment(new Date(info.blockTime * 1000)).format("YYYY/MM/DD HH:mm")
            : "未承認",
          type: "入金",
          detailUri: `${this.blockbook.explorer}${info.txid}`,
          value,
          fees: "0",
          partner: "不明",
          balance: "0",
          confirmations: info.confirmations
        });
      }
      // 出金の場合
      else if (hasMyInput && !isMyOutput) {
        const value =
          "-" +
          new BigNumber(info.value).dividedBy(this.digit).minus(
            info.vout.reduce((acc, output): BigNumber => {
              if (
                output.addresses.every((address): boolean => {
                  return allAddresses.includes(address);
                })
              ) {
                return acc.plus(output.value);
              } else {
                return acc;
              }
            }, new BigNumber(0))
          );
        const fees =
          "-" + new BigNumber(info.fees).dividedBy(this.digit).toString();
        txHistories.push({
          txid: info.txid,
          blockTime: info.blockTime,
          time: info.blockTime
            ? Moment(new Date(info.blockTime * 1000)).format("YYYY/MM/DD HH:mm")
            : "未承認",
          type: "出金",
          detailUri: `${this.blockbook.explorer}${info.txid}`,
          value,
          fees,
          partner: "不明",
          balance: "0",
          confirmations: info.confirmations
        });
      }
      // 自分への送金の場合
      else if (isMyInput && isMyOutput) {
        const fees =
          "-" + new BigNumber(info.fees).dividedBy(this.digit).toString();
        txHistories.push({
          txid: info.txid,
          blockTime: info.blockTime,
          time: info.blockTime
            ? Moment(new Date(info.blockTime * 1000)).format("YYYY/MM/DD HH:mm")
            : "未承認",
          type: "振替",
          detailUri: `${this.blockbook.explorer}${info.txid}`,
          value: "0",
          fees,
          partner: "自分",
          balance: "0",
          confirmations: info.confirmations
        });
      }
      // その他の場合
      else {
        throw new Error("トランザクションの種類の判定に失敗しました");
      }
    });
    // トランザクション履歴のソート(新しい順)
    txHistories.sort((a, b): number => {
      return b.blockTime - a.blockTime;
    });

    // balance計算
    let balance = new BigNumber(0);
    for (let i = txHistories.length - 1; i >= 0; i--) {
      balance = balance.plus(txHistories[i].value).plus(txHistories[i].fees);
      txHistories[i].balance = balance.toString();
    }
    this.txHistories = txHistories;
  }
}
