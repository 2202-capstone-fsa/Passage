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

    map.createLayer("Ground", townTileSet);
    map.createLayer("Houses", houseTileSet);
    map.createLayer("Walls", townTileSet);

    const player = this.add.sprite(800, 1100, "player", "green-walk-down-0");
    this.anims.create({
      key: "player-idle-down",
      frames: [{ key: "player", frame: "green-walk-down-0" }],
    });

    this.anims.create({
      key: "player-walk-down",
      frames: this.anims.generateFrameNames("player", {
        start: 0,
        end: 7,
        prefix: "green-walk-down-",
      }),
      repeat: -1,
      frameRate: 15,
    });

    player.anims.play("player-walk-down");

    // const houseTileSet = map.addTilesetImage("overworld", "houses");

    //map.create

    const housesLayer = map.createLayer("Houses", houseTileSet);
    const wallsLayer = map.createLayer("Walls", townTileSet);
    wallsLayer.setCollisionByProperty({ collides: true });
    housesLayer.setCollisionByProperty({ collides: true });
  }

  update() {
    this.processPlayerInput();
  }

  processPlayerInput() {
    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const player = this.player.body;

    if (this.cursors.up.isDown) {
      this.player.y -= 2;
      player.updateFromGameObject();
    } else if (this.cursors.left.isDown) {
      this.player.x -= 10;
      player.updateFromGameObject();
    } else if (this.cursors.right.isDown) {
      this.player.x += 10;
    }
  }
}
