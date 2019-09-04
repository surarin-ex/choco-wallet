import branchAndBound from "../../../functions/branchAndBound";
import Utxo from "../../../interfaces/utxo";
import getUtxosValue from "../../../functions/getUtxosValue";
import { assert } from "chai";
import BigNumber from "bignumber.js";
import estimateFees from "../../../functions/estimateFees";

describe("branchAndBound() のユニットテスト", (): void => {
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
      amount: "1550000",
      minOutValue: "63000"
    };
  });
  it("BnBでmatchしない場合、SRDで選択されてUTXOが重複なく十分な残高を含んでいる", (): void => {
    for (let i = 0; i < 10; i++) {
      const result = branchAndBound(options);
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
  it("全UTXOを使う場合でBnBでmatchする場合、インプットの合計と送金額+手数料が一致する", (): void => {
    options.amount = "5950000";
    const result = branchAndBound(options);
    const sumInput = getUtxosValue(result.selectedUtxos);
    assert.isFalse(result.hasChange);
    assert.deepEqual(
      new BigNumber(sumInput).toString(),
      new BigNumber(options.amount).plus(result.fees).toString(),
      "インプットの量が送金額と手数料の合計額と一致する"
    );
  });
  it("全UTXOを使わない場合でBnBでmatchする場合、インプットの合計と送金額+手数料が一致する", (): void => {
    options.amount = "2950000";
    const result = branchAndBound(options);
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
      branchAndBound(options);
      throw new Error("エラーがthrowされませんでした");
    } catch (err) {
      assert.notDeepEqual(err.message, "エラーがthrowされませんでした");
    }
  });
  it("インプットの合計と送金額+手数料が一致する場合に、すべてのUTXOが選択された結果が返される", (): void => {
    const fees = estimateFees({
      inputLength: 3,
      outputLength: 1,
      hasChange: false,
      ...options
    });
    options.amount = new BigNumber(6000000).minus(fees).toString();
    const result = branchAndBound(options);
    assert.isFalse(result.hasChange);
    assert.deepEqual(result.selectedUtxos.length, 3);
    assert.deepEqual(result.fees, fees);
  });
  it("送金額がインプットの合計-手数料よりも1だけ大きい場合に、エラーがthrowされる", (): void => {
    try {
      const fees = estimateFees({
        inputLength: 3,
        outputLength: 1,
        hasChange: false,
        ...options
      });
      options.amount = new BigNumber(6000000)
        .minus(fees)
        .plus(1)
        .toString();
      const result = branchAndBound(options);
      console.log(result);
      throw new Error("エラーがthrowされませんでした");
    } catch (err) {
      assert.notDeepEqual(err.message, "エラーがthrowされませんでした");
    }
  });
});
