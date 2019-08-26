export default interface Utxo {
    txid: string;
    index: number;
    amount: string;
    script: string;
    txHex: string;
    path: string;
    confirmations: number;
}
