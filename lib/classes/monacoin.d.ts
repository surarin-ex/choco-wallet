/**
 * Monacoinのクラス
 */
export default class Monacoin {
    private _seed;
    private _node;
    constructor(mnemonic: any);
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
}
