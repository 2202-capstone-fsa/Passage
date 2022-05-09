import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("houses", require("../../public/tiles/houses.png"));
    this.load.image("outside", require("../../public/tiles/outside.png"));
    this.load.tilemapTiledJSON(
      "overworld",
      require("../../public/tiles/overworld.json")
    );
  }

  create() {
    // let houses = this.add.image(10, 10, "houses");
    // houses.setDisplaySize(1000, 1000).setOrigin(0.5, 0.5);

    const map = this.make.tilemap({ key: "overworld" });

    const overworld = map.addTilesetImage("overworld", "Ground");

    // const houseTileSet = map.addTilesetImage("overworld", "houses");

    map.createLayer("Ground", overworld);
    //map.create
  }
}
