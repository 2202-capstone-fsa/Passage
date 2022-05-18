import Phaser from "phaser";
import data from "../../public/tiles/titlescreen.json";

export default class TitleScreen extends Phaser.Scene {
  constructor() {
    super("titlescreen");
  }

  preload() {
    //Load graphics of background
    this.load.image("atlantis", "tiles/cave/atlantis.png");

    this.load.tilemapTiledJSON("titlescreen", "tiles/titlescreen.json");

    //Load title
    this.load.image("title", "tiles/title.png");
  }

  create() {
    const map = this.make.tilemap({ key: "titlescreen" });
    console.log("In title");

    const titleTileSet = map.addTilesetImage("Atlantis", "atlantis");

    //Create Layer
    const titleBackLayer = map.createLayer("Background", titleTileSet);

    const titleFrontLayer = map.createLayer("Foreground", titleTileSet);

    titleBackLayer;
    titleFrontLayer;

    //Create the title png
    const items = this.physics.add.staticGroup();
    items.create(240, 200, "title");

    this.add.text(240, 300, "Press Space to Start", {}).setOrigin(0.5);

    this.input.keyboard.once(`keydown-SPACE`, () => {
      this.scene.start("home");
    });
  }

  update() {}
}
