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
      "NPC_Characters_v1/modernsprites.png",
      "NPC_Characters_v1/modernsprites.json"
    );
    this.load.audio("music", ["audio/HazyUniverse.mp3"]);
    this.load.audio("item", ["audio/sounds/item.mp3"]);
    this.load.audio("race", ["audio/Chopin-Maze.mp3"]);
    this.load.audio("wind", ["audio/sounds/wind2.mp3"]);
    this.load.audio("waterfall", ["audio/sounds/waterfall.mp3"]);
    this.load.audio("lights", ["audio/sounds/lights.mp3"]);
    this.load.audio("menu", ["audio/sounds/menu.mp3"]);
    this.load.audio("door", ["audio/sounds/door.mp3"]);
    this.load.audio("warp", ["audio/sounds/warp.wav"]);
    this.load.audio("splash", ["audio/sounds/cannon_miss.ogg"]);
    this.load.audio("error", ["audio/sounds/error.wav"]);
    this.load.audio("complete", ["audio/sounds/complete.wav"]);
    this.load.audio("knock", ["audio/sounds/knock.wav"]);
    this.load.audio("fanfare", ["audio/sounds/fanfare.wav"]);
    this.load.audio("poing", ["audio/sounds/poing.wav"]);
  }

  create() {
    if (localStorage["Dev"]) {
      window.scrollTo(250, 600);
      this.scene.start("home");
    } else {
      this.scene.start("titlescreen");
    }
  }
}
