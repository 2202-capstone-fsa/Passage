import Phaser from "phaser";
export default class Game extends Phaser.Scene {
    private parry;
    private cursors;
    private player;
    private message;
    private objLayer;
    private warning;
    constructor();
    preload(): void;
    create(): void;
    update(t: number, dt: number): void;
    spawn(): void;
    playDialogue(): void;
    exits(): void;
    accessWaterfall(): void;
}
