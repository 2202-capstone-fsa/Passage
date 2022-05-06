import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("houses", "tiles/houses.png");
    this.load.image("outside", "tiles/outside.png");
    this.load.atlas(
      "player",
      "NPC_Characters_v1/Male1.png",
      "NPC_Characters_v1/Male1Sprites.json"
    );
    this.load.tilemapTiledJSON("overworld", "tiles/overworld.json");
  }

  create() {
    const map = this.make.tilemap({ key: "overworld" });

    const townTileSet = map.addTilesetImage("Town", "outside");
    const houseTileSet = map.addTilesetImage("Houses", "houses");
    const player = this.add.sprite(10, 20, "player", "Male1.png");
    this.anims.create({
      key: "player-idle-down",
      frames: [{ key: "player", frame: "green-walk-side-0000.png" }],
    });

    player.anims.play("Male1.png");
    this.anims.create({
      key: "",
      frames: this.anims.generateFrameNames("player", {
        start: 1,
        end: 8,
        prefix: "run-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    // const houseTileSet = map.addTilesetImage("overworld", "houses");

    map.createLayer("Ground", townTileSet);
    map.createLayer("Houses", houseTileSet);
    map.createLayer("Walls", townTileSet);
    //map.create

    const housesLayer = map.createLayer("Houses", houseTileSet);
    const wallsLayer = map.createLayer("Walls", townTileSet);
    wallsLayer.setCollisionByProperty({ collides: true });
    housesLayer.setCollisionByProperty({ collides: true });
  }
}
