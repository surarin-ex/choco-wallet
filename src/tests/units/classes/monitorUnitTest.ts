import Monitor from "../../../classes/monitor";
import { assert } from "chai";

describe("Monitorクラスのユニットテスト", () => {
  describe("init() のユニットテスト", () => {
    let monitor: Monitor;
    beforeEach(() => {
      monitor = new Monitor("Monacoin", "test");
    });
    afterEach(() => {
      monitor.destroy();
    });
    it("blockbookへの接続ができる", async (): Promise<void> => {
      await monitor.init();
      // 接続できない場合はタイムアウトする
    });
  });

  describe("destroy() のユニットテスト", () => {
    let monitor: Monitor;
    beforeEach(async () => {
      monitor = new Monitor("Monacoin", "test");
      await monitor.init();
    });
    it("blockbookへの接続を解除できる", (): void => {
      monitor.destroy();
      // 接続解除できない場合はタイムアウトする
    });
  });

  describe("addAddresses() のユニットテスト", () => {
    let monitor: Monitor;
    beforeEach(async () => {
      monitor = new Monitor("Monacoin", "test");
      await monitor.init();
    });
    afterEach(() => {
      monitor.destroy();
    });
    it("アドレスリストに追加される", async () => {
      await monitor.addAddresses(["P1", "P2", "P3"]);
      assert.deepEqual(monitor.getAddresses()[0], "P1");
      assert.deepEqual(monitor.getAddresses()[1], "P2");
      assert.deepEqual(monitor.getAddresses()[2], "P3");
    });
    it("アドレスリストに同じアドレスが追加されない", async () => {
      await monitor.addAddresses(["P1", "P2", "P3"]);
      await monitor.addAddresses(["P1", "P4"]);
      assert.deepEqual(monitor.getAddresses()[0], "P1");
      assert.deepEqual(monitor.getAddresses()[1], "P2");
      assert.deepEqual(monitor.getAddresses()[2], "P3");
      assert.deepEqual(monitor.getAddresses()[3], "P4");
      assert.deepEqual(monitor.getAddresses().length, 4);
    });
  });

  describe("replaceAddresses() のユニットテスト", () => {
    let monitor: Monitor;
    beforeEach(async () => {
      monitor = new Monitor("Monacoin", "test");
      await monitor.init();
      await monitor.addAddresses(["P1", "P2", "P3"]);
    });
    afterEach(() => {
      monitor.destroy();
    });
    it("アドレスリストが洗い替えされる", async () => {
      await monitor.replaceAddresses(["P4", "P5"]);
      assert.deepEqual(monitor.getAddresses()[0], "P4");
      assert.deepEqual(monitor.getAddresses()[1], "P5");
    });
  });
});
