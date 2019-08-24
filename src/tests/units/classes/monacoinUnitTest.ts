import Monacoin from "../../../classes/monacoin";
import { assert } from "chai";
import BigNumber from "bignumber.js";
import estimateTxBytes from "../../../functions/estimateTxBytes";

describe("Monacoin のユニットテスト", (): void => {
  describe("getPath() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん"
        );
      }
    );
    it("おつりフラグ0、アドレスインデックス0で適切な値を取得できる", (): void => {
      const path = monacoin.getPath(0, 0);
      assert.deepEqual(path, "m/49'/22'/0'/0/0");
    });
    it("おつりフラグ1、アドレスインデックス100で適切な値を取得できる", (): void => {
      const path = monacoin.getPath(1, 100);
      assert.deepEqual(path, "m/49'/22'/0'/1/100");
    });
  });
  describe("getPaths() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん"
        );
      }
    );
    it("おつりフラグ0、アドレスインデックス0、長さ3で適切な値を取得できる", (): void => {
      const paths = monacoin.getPaths(0, 0, 3);
      assert.deepEqual(paths[0], "m/49'/22'/0'/0/0");
      assert.deepEqual(paths[1], "m/49'/22'/0'/0/1");
      assert.deepEqual(paths[2], "m/49'/22'/0'/0/2");
    });
    it("おつりフラグ1、アドレスインデックス100、長さ3で適切な値を取得できる", (): void => {
      const paths = monacoin.getPaths(1, 100, 3);
      assert.deepEqual(paths[0], "m/49'/22'/0'/1/100");
      assert.deepEqual(paths[1], "m/49'/22'/0'/1/101");
      assert.deepEqual(paths[2], "m/49'/22'/0'/1/102");
    });
  });
  describe("getAddress() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん"
        );
      }
    );
    it("正しいアドレスが生成される", (): void => {
      const path1 = monacoin.getPath(0, 0);
      const address1 = monacoin.getAddress(path1);
      const path2 = monacoin.getPath(0, 1);
      const address2 = monacoin.getAddress(path2);
      assert.deepEqual(address1, "PWimVa6tr6BaUX85ukxvuV1A8E5EnRpSqX");
      assert.deepEqual(address2, "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
    });
    it("英語のMnemonicからも正しいアドレスが生成される", (): void => {
      const monacoin2 = new Monacoin(
        "trend pledge shrug defense country task gain library mad fold plastic shock"
      );
      const path1 = monacoin2.getPath(0, 0);
      const address1 = monacoin2.getAddress(path1);
      const path2 = monacoin2.getPath(0, 1);
      const address2 = monacoin2.getAddress(path2);
      assert.deepEqual(address1, "PAuEJKctkDGaovTDXDVENLCJ1ARKeQcwT6");
      assert.deepEqual(address2, "PXiG48h62iGfaDWdMez4JkYgJHFB8hP7pb");
    });
  });
  describe("getAddresses() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん"
        );
      }
    );
    it("複数の正しいアドレスが生成される", (): void => {
      const paths = monacoin.getPaths(0, 0, 2);
      const addresses = monacoin.getAddresses(paths);
      assert.deepEqual(addresses[0], "PWimVa6tr6BaUX85ukxvuV1A8E5EnRpSqX");
      assert.deepEqual(addresses[1], "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
    });
    it("長さ1のとき、正しいアドレスが1つ入った配列が生成される", (): void => {
      const paths = monacoin.getPaths(0, 1, 1);
      const addresses = monacoin.getAddresses(paths);
      assert.deepEqual(addresses[0], "PVeMu6NFLKjKu7WoXHbx7h46f3DtqP2Xaz");
    });
    it("長さ0のとき、空の配列が生成される", (): void => {
      const paths = monacoin.getPaths(0, 0, 0);
      const addresses = monacoin.getAddresses(paths);
      assert.deepEqual(addresses, []);
    });
  });
  describe("updateAddressInfos() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん",
          "test"
        );
      }
    );
    it("アドレス情報が更新される", async (): Promise<void> => {
      await monacoin.updateAddressInfos({
        receivingAddressNum: 14,
        changeAddressNum: 6
      });
      const initialAddress = monacoin.addressInfos.find(
        (info): boolean => {
          return info.index === 0 && info.isChange === false;
        }
      );
      assert.deepEqual(
        initialAddress.address,
        "p6jm4kuLCWozhhD9BP6t7Y5zEkXHVcYV7b"
      );
      assert.deepEqual(initialAddress.isSpent, true);
      assert.deepEqual(initialAddress.path, "m/49'/1'/0'/0/0");
      assert.isNotEmpty(initialAddress.txids);
      assert.isTrue(
        monacoin.addressInfos.filter(
          (info): boolean => {
            return !info.isChange;
          }
        ).length >= 14
      );
      assert.isTrue(
        monacoin.addressInfos.filter(
          (info): boolean => {
            return info.isChange;
          }
        ).length >= 6
      );
      assert.deepEqual(monacoin.balance, "499950200");
      assert.deepEqual(monacoin.balanceReadable, "4.999502");
      assert.deepEqual(
        monacoin.receiveAddress,
        monacoin.addressInfos.find(
          (info): boolean => {
            return !info.isChange && !info.isSpent;
          }
        ).address
      );
      assert.deepEqual(
        monacoin.changeAddress,
        monacoin.addressInfos.find(
          (info): boolean => {
            return info.isChange && !info.isSpent;
          }
        ).address
      );
    });
  });
  describe("updateTxInfos() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん",
          "test"
        );
      }
    );
    it("トランザクション情報が更新される", async (): Promise<void> => {
      await monacoin.updateTxInfos();
      assert.deepEqual(monacoin.txInfos.length, 4);
    });
  });
  describe("estimateFeeRate() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん",
          "main"
        );
      }
    );
    it("150watanabe/byte以上の手数料が取得される", async (): Promise<void> => {
      const feeRate = await monacoin.estimateFeeRate("min");
      assert.isTrue(new BigNumber(feeRate).gte(150));
    });
    it("fast normal slow min の順に手数料が小さくなる", async (): Promise<
      void
    > => {
      const feeRate_fast = await monacoin.estimateFeeRate("fast");
      const feeRate_normal = await monacoin.estimateFeeRate("normal");
      const feeRate_slow = await monacoin.estimateFeeRate("slow");
      const feeRate_min = await monacoin.estimateFeeRate("min");
      assert.isTrue(
        new BigNumber(feeRate_fast).gte(new BigNumber(feeRate_normal))
      );
      assert.isTrue(
        new BigNumber(feeRate_normal).gte(new BigNumber(feeRate_slow))
      );
      assert.isTrue(
        new BigNumber(feeRate_slow).gte(new BigNumber(feeRate_min))
      );
      assert.isTrue(
        new BigNumber(feeRate_min).gte(new BigNumber(monacoin.minFeeRate))
      );
    });
  });
  describe("createUnsignedTx() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    before(
      "インスタンス作成",
      (): void => {
        monacoin = new Monacoin(
          "なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう",
          "test"
        );
      }
    );
    it("unsignedTxに含まれるデータの整合性が取れている", async (): Promise<
      void
    > => {
      await monacoin.updateUnsignedTx({
        toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
        amount: "1000000",
        feeRate: 150
      });
      const {
        amount,
        amount_mona,
        fees,
        fees_mona,
        feeRate,
        sumInput,
        sumInput_mona,
        inputCount,
        toAddress
      } = monacoin.getUnsignedTxSummary();
      assert.isTrue(
        new BigNumber(sumInput)
          .minus(new BigNumber(amount))
          .minus(new BigNumber(fees))
          .gte(0)
      );
      assert.deepEqual(toAddress, "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs");
      assert.isTrue(inputCount > 0);
      assert.deepEqual(
        new BigNumber(amount).dividedBy(monacoin.digit).toString(),
        amount_mona
      );
      assert.deepEqual(
        new BigNumber(fees).dividedBy(monacoin.digit).toString(),
        fees_mona
      );
      assert.deepEqual(
        new BigNumber(sumInput).dividedBy(monacoin.digit).toString(),
        sumInput_mona
      );
      assert.deepEqual(feeRate, 150);
    });
    it("amountにマイナスを指定するとエラーがthrowされる", async (): Promise<
      void
    > => {
      try {
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "-1000",
          feeRate: 150
        });
        throw new Error("エラーが発生しませんでした");
      } catch (err) {
        assert.deepEqual(err.message, "送金額が不適切です");
      }
    });
    it("amountに小数を指定するとエラーがthrowされる", async (): Promise<
      void
    > => {
      try {
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "100000.1",
          feeRate: 150
        });
        throw new Error("エラーが発生しませんでした");
      } catch (err) {
        assert.deepEqual(err.message, "送金額が不適切です");
      }
    });
    it("amountに数字以外の文字列を指定するとエラーがthrowされる", async (): Promise<
      void
    > => {
      try {
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "aaa",
          feeRate: 150
        });
        throw new Error("エラーが発生しませんでした");
      } catch (err) {
        assert.deepEqual(err.message, "送金額が不適切です");
      }
    });
    it("amountに残高を超える金額を指定するとエラーがthrowされる", async (): Promise<
      void
    > => {
      try {
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "100000000000",
          feeRate: 150
        });
        throw new Error("エラーが発生しませんでした");
      } catch (err) {
        assert.deepEqual(err.message, "残高不足です");
      }
    });
    it("feeRateにminFeeRateを下回る金額を指定するとエラーがthrowされる", async (): Promise<
      void
    > => {
      try {
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "10000",
          feeRate: 50
        });
        throw new Error("エラーが発生しませんでした");
      } catch (err) {
        assert.deepEqual(err.message, "手数料のレートが不適切です");
      }
    });
    it("feeRateに小数を指定するとエラーがthrowされる", async (): Promise<
      void
    > => {
      try {
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "10000",
          feeRate: 200.5
        });
        throw new Error("エラーが発生しませんでした");
      } catch (err) {
        assert.deepEqual(err.message, "手数料のレートが不適切です");
      }
    });
    it("送金額がインプットの合計と手数料の和と一致する場合におつりアドレスへの送金がなくなる", async (): Promise<
      void
    > => {
      await monacoin.updateAddressInfos();
      await monacoin.updateTxInfos();
      await monacoin.updateUnsignedTx({
        toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
        amount: "1000000",
        feeRate: 150
      });
      const summary = monacoin.getUnsignedTxSummary();
      const estimateFees =
        estimateTxBytes({ "P2SH-P2WPKH": summary.inputCount }, { P2SH: 1 }) *
        150;
      await monacoin.updateUnsignedTx({
        toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
        amount: new BigNumber(summary.sumInput).minus(estimateFees).toString(),
        feeRate: 150
      });
      monacoin.signTx();
      const signedSummary = monacoin.getSignedTxSummary();
      assert.isNull(signedSummary.change);
    });
  });
  describe("signTx() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    beforeEach(
      "インスタンス作成",
      async (): Promise<void> => {
        monacoin = new Monacoin(
          "なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう",
          "test"
        );
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "1000000",
          feeRate: 150
        });
      }
    );
    afterEach(
      (): void => {
        monacoin.deleteSignedTx();
      }
    );
    it("署名後のトランザクションの情報が取得できる", (): void => {
      monacoin.signTx();
      const summary = monacoin.getSignedTxSummary();
      assert.deepEqual(
        summary.outs[0].address,
        "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs"
      );
      assert.deepEqual(summary.change.address, monacoin.changeAddress);
      assert.deepEqual(summary.amount, "1000000");
      assert.deepEqual(summary.configuredFeeRate, 150);
      assert.isTrue(
        Math.abs((summary.confirmedFeeRate - 150) / summary.confirmedFeeRate) <
          0.02
      ); // 実際のfeeRateと指定したfeeRateの誤差が2%以内
    });
  });
  describe("broadcastTx() のユニットテスト", (): void => {
    let monacoin: Monacoin;
    beforeEach(
      "インスタンス作成",
      async (): Promise<void> => {
        monacoin = new Monacoin(
          "なめらか　からい　ひやけ　げきか　なにごと　かわら　こもち　おおや　おもう　こうかん　れいぎ　とそう",
          "test"
        );
        await monacoin.updateUnsignedTx({
          toAddress: "pQ1Lzx4hm7SrnfQ2LWihzB1JLosvC166Hs",
          amount: "1000000",
          feeRate: 150
        });
        await monacoin.signTx();
      }
    );
    it("署名済みトランザクションがない場合、nullが返される", async (): Promise<
      void
    > => {
      monacoin.deleteSignedTx();
      const txid = await monacoin.broadcastTx();
      assert.isNull(txid);
    });
    it("トランザクションを送信するとtxidが返される", async (): Promise<
      void
    > => {
      const summary = monacoin.getSignedTxSummary();
      const txid = await monacoin.broadcastTx();
      assert.deepEqual(txid, summary.txid);
    });
  });
});
