export default interface AddressInfo {
    address: string;
    path: string;
    isSpent: boolean;
    isChange: boolean;
    index: number;
    balance: string;
    unconfirmedBalance: string;
    txids?: string[];
}
