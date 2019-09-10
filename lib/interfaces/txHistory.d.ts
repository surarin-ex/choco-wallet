export default interface TxHistory {
    txid: string;
    blockTime: number;
    time: string;
    type: string;
    detailUri: string;
    value: string;
    fees: string;
    partner: string;
    balance: string;
    confirmations: number;
}
