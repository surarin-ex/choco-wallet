import Monacoin from "../../../classes/monacoin";
import { assert } from "chai";
import BigNumber from "bignumber.js";

describe.only("Monacoin のユニットテスト", (): void => {
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
      const feeRate = await monacoin.estimateFeeRate("slow");
      assert.isTrue(new BigNumber(feeRate).gte(150));
    });
    it("fast normal slow の順に手数料が小さくなる", async (): Promise<void> => {
      const feeRate_fast = await monacoin.estimateFeeRate("fast");
      const feeRate_normal = await monacoin.estimateFeeRate("normal");
      const feeRate_slow = await monacoin.estimateFeeRate("slow");
      assert.isTrue(
        new BigNumber(feeRate_fast).gte(new BigNumber(feeRate_normal))
      );
      assert.isTrue(
        new BigNumber(feeRate_normal).gte(new BigNumber(feeRate_slow))
      );
    });
  });
});
