import Phaser from "phaser";
export default class start extends Phaser.Scene {
    private parry;
    private cursors;
    private player;
    private message;
    private objLayer;
    private warning;
    private typewriteText;
    constructor();
    preload(): void;
    create(): void;
    update(t: number, dt: number): void;
}
