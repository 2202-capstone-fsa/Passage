import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("preloader");
  }

  preload() {
    //Load player sprite into game.
    this.load.atlas(
      "player",
      "NPC_Characters_v1/Male4.png",
      "NPC_Characters_v1/MaleSprites.json"
    );
    this.load.audio("music", ["audio/2.mp3"]);
    this.load.audio("item", ["audio/sounds/item.mp3"]);
    this.load.audio("race", ["audio/Chopin-Maze.mp3"]);
    this.load.audio("wind", ["audio/sounds/wind1.mp3"]);
    this.load.audio("waterfall", ["audio/sounds/waterfall.mp3"]);
    this.load.audio("lights", ["audio/sounds/lights.mp3"]);
    this.load.audio("menu", ["audio/sounds/menu.mp3"]);
    this.load.audio("door", ["audio/sounds/door.mp3"]);
  }

  create() {
    this.scene.start("ending");
  }
}
