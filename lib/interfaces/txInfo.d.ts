export default interface TxInfo {
    txid: string;
    version: number;
    lockTime: number;
    vin: {
        txid: string;
        vout?: number;
        sequence: number;
        n: number;
        addresses: string[];
        isAddress: boolean;
        value: string;
        hex: string;
    }[];
    vout: {
        value: string;
        n: number;
        hex: string;
        addresses: string[];
        isAddress: boolean;
    }[];
    blockHash: string;
    blockHeight: number;
    confirmations: number;
    blockTime: number;
    value: string;
    valueIn: string;
    fees: string;
    hex: string;
}
