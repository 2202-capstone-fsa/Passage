import Phaser from "phaser";
export default class Game extends Phaser.Scene {
    private cursors;
    private player;
    private message;
    constructor();
    preload(): void;
    create(): void;
    update(t: number, dt: number): void;
    exits(): void;
    playDialogue(): void;
    spawn(): void;
}
