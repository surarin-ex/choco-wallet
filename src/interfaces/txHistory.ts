export default interface TxHistory {
  txid: string;
  blockTime: number;
  time: string;
  type: string;
  detailUri: string;
  value: string; // MONA
  fees: string; // MONA
  partner: string;
  balance: string; // MONA
  confirmations: number;
}
