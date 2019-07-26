import createBlockbook, { Blockbook } from "../../../classes/blockbook";
import endpointList from "../../../conf/blockbookList";
import { assert } from "chai";

describe("Blockbook のユニットテスト", (): void => {
  describe("createBlockbook() のユニットテスト", async (): Promise<void> => {
    it("初期化できる", async (): Promise<void> => {
      const blockbook = await createBlockbook();
      const uris = endpointList.map(
        (endpoint: any): string => {
          return endpoint.uri;
        }
      );
      assert.deepInclude(uris, blockbook.endpoint);
      assert.deepEqual(blockbook.coin, "Monacoin");
      assert.deepEqual(blockbook.chain, "main");
    });

    it("テストネットで初期化できる", async (): Promise<void> => {
      const blockbook = await createBlockbook("test", "Monacoin");
      const uris = endpointList.map(
        (endpoint: any): string => {
          return endpoint.uri;
        }
      );
      assert.deepInclude(uris, blockbook.endpoint);
      assert.deepEqual(blockbook.coin, "Monacoin Testnet");
      assert.deepEqual(blockbook.chain, "test");
    });
  });
  describe("getAddressInfo() のユニットテスト", (): void => {
    let blockbook: Blockbook;
    before(
      "testnetで初期化",
      async (): Promise<void> => {
        blockbook = await createBlockbook("test", "Monacoin");
      }
    );
    it("取引実績のあるアドレス情報を取得できる", async (): Promise<void> => {
      const addressInfo = await blockbook.getBlockbookAddress(
        "pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n"
      );
      assert.deepEqual(addressInfo.page, 1);
      assert.deepEqual(addressInfo.totalPages, 1);
      assert.deepEqual(addressInfo.itemsOnPage, 1000);
      assert.deepEqual(
        addressInfo.address,
        "pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n"
      );
      assert.deepEqual(addressInfo.balance, "0");
      assert.deepEqual(addressInfo.totalReceived, "332000000");
      assert.deepEqual(addressInfo.totalSent, "332000000");
      assert.deepEqual(addressInfo.unconfirmedBalance, "0");
      assert.deepEqual(addressInfo.unconfirmedTxs, 0);
      assert.deepEqual(addressInfo.txs, 5);
      assert.deepEqual(addressInfo.txids, [
        "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff",
        "1b0f415d238a99f1d0334061ae25e89b198069f65d14fe967181aa9b0a961fe0",
        "301b5f8aa9f7e2a87987994adcf99ce354b9a525f6f0b7175d4705bc00e656a4",
        "9216bc0f77d5c8b6c4957ef0a5b301abe76fe2ab83b09ec1ea964dff98cfba3e",
        "d388f60337c43495e3db6b882350b6188e7f5ffcfb1c8f5ed8b792bc0486d788"
      ]);
    });
    it("取引実績のないアドレス情報を取得できる", async (): Promise<void> => {
      const addressInfo = await blockbook.getBlockbookAddress(
        "pNdFKgQTK1PFeeBiBfbY9MpDouCbNRmAyt"
      );
      assert.deepEqual(addressInfo.page, 1);
      assert.deepEqual(addressInfo.totalPages, 1);
      assert.deepEqual(addressInfo.itemsOnPage, 1000);
      assert.deepEqual(
        addressInfo.address,
        "pNdFKgQTK1PFeeBiBfbY9MpDouCbNRmAyt"
      );
      assert.deepEqual(addressInfo.balance, "0");
      assert.deepEqual(addressInfo.totalReceived, "0");
      assert.deepEqual(addressInfo.totalSent, "0");
      assert.deepEqual(addressInfo.unconfirmedBalance, "0");
      assert.deepEqual(addressInfo.unconfirmedTxs, 0);
      assert.deepEqual(addressInfo.txs, 0);
      assert.isUndefined(addressInfo.txids);
    });
  });
  describe("getAddressInfos() のユニットテスト", (): void => {
    let blockbook: Blockbook;
    const addresses = [
      "pTUe8n9ZGgXybNc9z4Xi1BcPAWeUpnqd4n",
      "p87WBVtXHiJoxUTtnFawuaNK1uiErYsTTD",
      "pSK6eGBMtaY5uwythgzLmisQE8nz8JdG6S",
      "p9itkWdw8H5T1ZdZnBjyGL6AUyPK2HZBgV",
      "pEuK4ffetaAUHRtwQQvzkEhKMYVa2pb8ba",
      "pP9MzRUvFLpDMg53HTCXgt6dyxgeMAK6Bc",
      "pS1irqkEh5ekRq1Lmhg6VHwncccfTDvosW",
      "pFh73SeGpu3ttNHAxsVu3grsQhrgq95BDL",
      "pRj7bagxt8L5amDkxCtzsXSitBNURpC5G2",
      "pSvU4HqLJ3iDJ3cYxiaTmz3zmn6nDBUCi5",
      "pAL2nJYHWw5JamQsVgX4efyJ9zcKf611ag",
      "pNukdwq7etemieXPsPjjRYUq8HW5RTpStw",
      "p9saYVd4ZfqJQYJ7xMXdffJesry6BKxofP",
      "pBD4TrrFDGKHUNbptQxnm2hxsg5wu53boY",
      "pJVcF5N6aADSHsLKM8euqyra2KqoDsVBf8",
      "pMNJQVB5iX9MyRfMRrpweQ9dpR1WBie2BQ",
      "pTVKfWobV57RXbbE4852jkx2e63JhLotmh",
      "pCtTqch8X6B95DGfA3XrGBmXHTYf1sW1sG",
      "pQwFupKyXxweZNbNupCikwChfivRvLn9tP",
      "p92eKTg3ENbyaE2GDAxgTZYegp3Y6riwaW",
      "pUD7D4dqqWBjJBdRdYJW9XsvxXsYcZd7Ub",
      "pQNK2FXxsLK3miya5SECsRSUwXbakb5zau",
      "pLh6EuQoFRNVv5efcqU8qqiMJVPqvb65TV",
      "pNdFKgQTK1PFeeBiBfbY9MpDouCbNRmAyt",
      "pM1EMe8E3ngsJEoaAb1gjrdUiaRPMYW3E8",
      "pMn2R44yuZQdxNZYbzMx7YpAFpY4TP2ooL",
      "pNKD9yAGhsbRMr6uvbzqYY3tKsTLmbBBRu",
      "pE4whubV3yp8rjatCGZJArAAvr9pyJDfV6",
      "p8naCdQNrF4kmCqT8mtsCAVwZuHKTzob2a",
      "pKavEGHz4KrcMtdckvhMTeEXDxsVEszJxM",
      "p9rciTjpQTfESCNgc8gqWvjjUsp9mNjepY",
      "pTcwCTErvgzP64V2jfiWWZuHRpdmVrCdKF",
      "pCuVaeD5QL6WGx9Q3gqAKRPSxZKKnfBaTP",
      "pCcsJyEPMa44G499KsYgdnAiz2umia2G8K",
      "pH316wnSqMzz6GgdqUmp1KzkDXALsMwoCL",
      "p7FwKnSLkXSYSqCBiqZtkQYau7fcb27j5g"
    ];

    before(
      "testnetで初期化",
      async (): Promise<void> => {
        blockbook = await createBlockbook("test", "Monacoin");
      }
    );
    it("複数のアドレス情報を取得できる", async (): Promise<void> => {
      const addressInfos = await blockbook.getBlockbookAddresses(addresses);
      for (let addressInfo of addressInfos) {
        assert.deepInclude(addresses, addressInfo.address);
      }
    });
  });
  describe("getTxInfo() のユニットテスト", (): void => {
    let blockbook: Blockbook;
    before(
      "testnetで初期化",
      async (): Promise<void> => {
        blockbook = await createBlockbook("test", "Monacoin");
      }
    );
    it("トランザクション情報を取得できる", async (): Promise<void> => {
      const txid =
        "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff";
      const txInfo = await blockbook.getBlockbookTx(txid);
      assert.deepEqual(
        txInfo.txid,
        "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff"
      );
      assert.deepEqual(
        txInfo.vin[0].addresses[0],
        "pNKD9yAGhsbRMr6uvbzqYY3tKsTLmbBBRu"
      );
    });
  });
  describe("getBlockbookTxs() のユニットテスト", (): void => {
    let blockbook: Blockbook;
    const txids = [
      "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff",
      "1b0f415d238a99f1d0334061ae25e89b198069f65d14fe967181aa9b0a961fe0"
    ];
    before(
      "testnetで初期化",
      async (): Promise<void> => {
        blockbook = await createBlockbook("test", "Monacoin");
      }
    );
    it("複数のトランザクション情報を取得できる", async (): Promise<void> => {
      const txInfos = await blockbook.getBlockbookTxs(txids);
      assert.deepEqual(
        txInfos[0].txid,
        "8bc9ff20cc6a29b2db60e608225931fc3c04eaab09bebd9693f6fdd10f9542ff"
      );
      assert.deepEqual(
        txInfos[1].txid,
        "1b0f415d238a99f1d0334061ae25e89b198069f65d14fe967181aa9b0a961fe0"
      );
    });
  });
});
