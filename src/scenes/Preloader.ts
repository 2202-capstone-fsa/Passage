import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "tiles/houses.png");
    this.load.tilemapTiledJSON("overworld", "tiles/overworld.json");

    // this.load.atlas("faune", "character/fauna.png", "character/fauna.json");
  }

  create() {
    this.scene.start("game");
  }
}
