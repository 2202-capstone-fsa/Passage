import Phaser from "phaser";
export default class Game extends Phaser.Scene {
    private cursors;
    private player;
    private nurse;
    private doctor;
    private message;
    private lights;
    constructor();
    preload(): void;
    create(): void;
    update(t: number, dt: number): void;
    exits(): void;
    checkKeycard(): void;
    playDialogue(): void;
    spawn(): void;
}
