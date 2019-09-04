import Utxo from "../../../interfaces/utxo";
import singleRandomDraw from "../../../functions/singleRandomDraw";
import getUtxosValue from "../../../functions/getUtxosValue";
import { assert } from "chai";
import BigNumber from "bignumber.js";

describe("singRandomDraw() のユニットテスト", (): void => {
  let options: {
    utxos: Utxo[];
    feeRate: number;
    inputType: string;
    outputType: string;
    amount: string;
    minOutValue: string;
  };
  beforeEach((): void => {
    options = {
      utxos: [
        {
          txid: "txid1",
          index: 0,
          amount: "1000000",
          script: "",
          txHex: "",
          path: "",
          confirmations: 1000
        },
        {
          txid: "txid2",
          index: 0,
          amount: "2000000",
          script: "",
          txHex: "",
          path: "",
          confirmations: 1000
        },
        {
          txid: "txid3",
          index: 0,
          amount: "3000000",
          script: "",
          txHex: "",
          path: "",
          confirmations: 1000
        }
      ],
      feeRate: 150,
      inputType: "P2SH-P2WPKH",
      outputType: "P2PKH",
      amount: "1950000",
      minOutValue: "63000"
    };
  });
  it("選択されたUTXOが重複なく十分な残高を含んでいる", (): void => {
    for (let i = 0; i < 10; i++) {
      const result = singleRandomDraw(options);
      const sumInput = getUtxosValue(result.selectedUtxos);
      const count = {
        txid1: 0,
        txid2: 0,
        txid3: 0
      };
      result.selectedUtxos.forEach((utxo): void => {
        count[utxo.txid]++;
      });
      assert.isTrue(
        new BigNumber(sumInput)
          .minus(result.fees)
          .minus(options.minOutValue)
          .gt(0)
      );
      assert.isTrue(count.txid1 <= 1, "txid1 <= 1");
      assert.isTrue(count.txid2 <= 1, "txid2 <= 1");
      assert.isTrue(count.txid3 <= 1, "txid3 <= 1");
    }
  });
  it("おつりを作らない場合に、インプットの合計と送金額+手数料が一致する", (): void => {
    options.amount = "5950000";
    const result = singleRandomDraw(options);
    const sumInput = getUtxosValue(result.selectedUtxos);
    assert.isFalse(result.hasChange);
    assert.deepEqual(
      new BigNumber(sumInput).toString(),
      new BigNumber(options.amount).plus(result.fees).toString(),
      "インプットの量が送金額と手数料の合計額と一致する"
    );
  });
  it("残高不足の場合に、エラーがthrowされる", (): void => {
    try {
      options.amount = "15950000";
      singleRandomDraw(options);
      throw new Error("エラーがthrowされませんでした");
    } catch (err) {
      assert.notDeepEqual(err.message, "エラーがthrowされませんでした");
    }
  });
});
