import Phaser from "phaser";
export default class Game extends Phaser.Scene {
    private cursors;
    private player;
    private message;
    private objLayer;
    private waterfall;
    constructor();
    preload(): void;
    create(): void;
    update(t: number, dt: number): void;
    exits(): void;
    playDialogue(): void;
    grabItems(): void;
}
