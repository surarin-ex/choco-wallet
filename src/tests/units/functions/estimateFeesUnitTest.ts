import estimateFees from "../../../functions/estimateFees";
import { assert } from "chai";

describe("estimateFees のユニットテスト", (): void => {
  let options: {
    inputLength: number;
    outputLength: number;
    hasChange: boolean;
    feeRate: number;
    inputType: string;
    outputType: string;
  };
  beforeEach((): void => {
    options = {
      inputLength: 1,
      outputLength: 1,
      hasChange: true,
      feeRate: 150,
      inputType: "P2SH-P2WPKH",
      outputType: "P2PKH"
    };
  });

  it("手数料を計算できる", (): void => {
    const fees = estimateFees(options);
    assert.deepEqual(fees, "25200");
  });
  it("入力・出力・おつりがない場合に入出力を除く部分の手数料を計算できる", (): void => {
    options.hasChange = false;
    options.inputLength = 0;
    options.outputLength = 0;
    const fees = estimateFees(options);
    assert.deepEqual(fees, "1650");
  });
  it("存在しないinputTypeを指定した場合、エラーをthrowする", (): void => {
    try {
      options.inputType = "INVALID";
      const fees = estimateFees(options);
      console.log(fees);
      throw new Error("エラーが発生しませんでした");
    } catch (err) {
      assert.notDeepEqual(err.message, "エラーが発生しませんでした");
    }
  });
});
