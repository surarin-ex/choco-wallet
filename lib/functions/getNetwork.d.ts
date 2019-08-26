declare const getNetwork: (coin: "Monacoin", chain: "main" | "test") => {
    wif: number;
    bip32: {
        public: number;
        private: number;
    };
    messagePrefix: string;
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
};
export default getNetwork;
