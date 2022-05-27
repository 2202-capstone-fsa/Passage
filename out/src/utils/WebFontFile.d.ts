import Phaser from "phaser";
export default class WebFontFile extends Phaser.Loader.File {
    /**
     * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {string | string[]} fontNames
     * @param {string} [service]
     */
    private fontNames;
    private service;
    constructor(loader: any, fontNames: any, service?: string);
    load(): void;
}
