import Monacoin from "../../../classes/monacoin";
import { assert } from "chai";

describe("Monacoin のユニットテスト", (): void => {
  let monacoin: Monacoin;
  before(
    "インスタンス作成",
    (): void => {
      monacoin = new Monacoin(
        "むける　とかい　はんこ　ぐあい　きけんせい　ほそい　さゆう　そぼく　たいてい　さくら　とおか　はろうぃん"
      );
    }
  );
  describe("getPath() のユニットテスト", (): void => {
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
});
