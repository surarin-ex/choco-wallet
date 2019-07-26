/**
 * Monacoinのクラス
 */
export default class Monacoin {
    private _seed;
    private _node;
    private _chain;
    private _coin;
    private _network;
    private _pathBase;
    constructor(mnemonic: string, chain?: "main" | "test");
    /**
     * おつりフラグとアドレスインデックスを指定してbip32のpathを取得する
     * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
     * @param addressIndex アドレスのインデックス 0からカウントアップしていく
     */
    getPath(changeFlag: 0 | 1, addressIndex: number): string;
    /**
     * スタート位置のおつりフラグとアドレスインデックスを指定し、長さを指定することで、指定した長さのbip32のpath配列を取得する
     * @param changeFlag おつりフラグ "1"の場合はおつりを表し、"0"の場合は受取アドレスを表す
     * @param addressIndex アドレスのインデックス 0からカウントアップしていく
     * @param length 長さ、10を指定するとaddressIndex〜addressIndex+9までの10要素の配列が取得できる
     */
    getPaths(changeFlag: 0 | 1, addressIndex: number, length: number): string[];
    /**
     * bip32のpathを指定してアドレスを取得する
     * @param path bip32のpath
     */
    getAddress(path: string): string;
    /**
     * pathの配列に対応するアドレスの配列を取得する
     * @param paths pathの配列
     */
    getAddresses(paths: string[]): string[];
    /**
     * 未使用アドレス連続数を取得するメソッド
     * @param addressInfos アドレス情報の配列
     * @param startSequence 未使用アドレス連続数の初期値
     */
    private _getUnspentAddressSequence;
    /**
     * アドレスの種類・個数を指定して、パスとアドレス情報を取得し、返り値としてそれらを詰め込んだオブジェクトと未使用アドレスの連続数を出力するメソッド。
     * gap limit を補償するために使用する未使用アドレスの連続数を計算して返り値として返す。
     * @type {object} allAddressData - アドレス情報とそのパスをまとめたオブジェクト
     * @property {string[]} allPaths パスの配列
     * @property {BlockbookAddress[]} allBlockbookAddress blockbookから取得するアドレス情報の格納先
     * @type {object} options 引数のオブジェクト
     * @property {object} blockbook Blockbookオブジェクト
     * @property {object} allAddressData アドレス情報とパスをまとめたオブジェクト
     * @property {0 | 1} isChange おつりフラグ
     * @property {number} startIndex 取得するアドレスの最初のインデックス
     * @property {number} length 取得するアドレスの個数
     * @property {number} startSequence 未使用アドレスの連続数の初期値
     * @return {object} 全アドレス情報と未使用アドレスの連続数
     * @property {object} allAddressData 元のアドレス情報と取得した全アドレス情報をマージしたオブジェクト
     * @property {number} unspentSequence 未使用アドレスの連続数
     */
    private _getAddressInfo;
    /**
     * GAP_LIMITまでの全アドレス情報を取得するメソッド
     * @type {object} options 引数のオブジェクト
     * @property {number} receivingAddressNum 最低限取得する受取アドレスの個数
     * @property {number} changeAddressNum 最低限取得するおつりアドレスの個数
     * @param options 引数のオブジェクト
     */
    getAllAddressInfo(options?: {
        receivingAddressNum: number;
        changeAddressNum: number;
    }): Promise<{
        address: string;
        path: string;
        isSpent: boolean;
        isChange: boolean;
        index: number;
        balance: string;
        unconfirmedBalance: string;
        txids?: string[];
    }[]>;
}
