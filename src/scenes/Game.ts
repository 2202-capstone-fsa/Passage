import Phaser from "phaser";
import { isSpreadElement } from "typescript";
import { debugDraw } from "../utils/debug";

export default class Game extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("game");
  }

  preload() {
    //Load graphics for houses, outside, and player.
    this.load.image("houses", "tiles/houses.png");
    this.load.image("outside", "tiles/outside.png");
    this.load.atlas(
      "player",
      "NPC_Characters_v1/Male4.png",
      "NPC_Characters_v1/MaleSprites.json"
    );

    //Load data (collisions, etc) for the map.
    this.load.tilemapTiledJSON("overworld", "tiles/overworld.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "overworld" });
    const townTileSet = map.addTilesetImage("Town", "outside");
    const houseTileSet = map.addTilesetImage("Houses", "houses");

    //Create ground layer first using tile set data.
    const groundLayer = map.createLayer("Ground", townTileSet);

    /* Add Player sprite to the game.
      In the sprite json file, for any png of sprites,
      the first set of sprites is called "green"
      the second set is called "teal"
      the third set is called "brown"
      and the fourth set is called "doc"
    */
    this.player = this.physics.add.sprite(
      800,
      800,
      "player",
      "doc-walk-down-0"
    );
    this.player.body.setSize(this.player.width * 1, this.player.height * 1);
    this.player.setCollideWorldBounds(true);

    //Create idle animations for direction player is facing.
    this.anims.create({
      key: "player-idle-down",
      frames: [{ key: "player", frame: "doc-walk-down-0" }],
    });
    this.anims.create({
      key: "player-idle-side",
      frames: [{ key: "player", frame: "doc-walk-side-0" }],
    });
    this.anims.create({
      key: "player-idle-up",
      frames: [{ key: "player", frame: "doc-walk-up-0" }],
    });

    //Create animations for player motions.
    this.anims.create({
      key: "player-walk-down",
      frames: this.anims.generateFrameNames("player", {
        start: 3,
        end: 6,
        prefix: "doc-walk-down-",
      }),
      repeat: -1,
      frameRate: 6,
    });

    this.anims.create({
      key: "player-walk-up",
      frames: this.anims.generateFrameNames("player", {
        start: 3,
        end: 6,
        prefix: "doc-walk-up-",
      }),
      repeat: -1,
      frameRate: 6,
    });

    this.anims.create({
      key: "player-walk-side",
      frames: this.anims.generateFrameNames("player", {
        start: 3,
        end: 6,
        prefix: "doc-walk-side-",
      }),
      repeat: -1,
      frameRate: 6,
    });

    //Create houses and walls in this world, over the Ground and Player.
    const housesLayer = map.createLayer("Houses", houseTileSet);
    const wallsLayer = map.createLayer("Walls", townTileSet);

    // this.cameras.main.startFollow(this.player, true);
    // this.cameras.main.setBounds(0, 0, 1600, 1600);
    // this.cameras.main.centerOn(600, 600);

    //Set walls and houses to collide with Player.
    wallsLayer.setCollisionByProperty({ collides: true });
    housesLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, housesLayer);

    debugDraw(wallsLayer, this);
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    const speed = 120;

    if (this.cursors.left?.isDown) {
      this.player.anims.play("player-walk-side", true);
      this.player.setVelocity(-speed, 0);
      this.player.scaleX = 1;
      this.player.body.offset.x = 0;
    } else if (this.cursors.right?.isDown) {
      this.player.anims.play("player-walk-side", true);
      this.player.setVelocity(speed, 0);
      this.player.scaleX = -1;
      this.player.body.offset.x = 16;
    } else if (this.cursors.down?.isDown) {
      this.player.anims.play("player-walk-down", true);
      this.player.setVelocity(0, speed);
      this.player.body.offset.y = 0;
    } else if (this.cursors.up?.isDown) {
      this.player.anims.play("player-walk-up", true);
      this.player.setVelocity(0, -speed);
      this.player.body.offset.y = 0;
    } else {
      if (!this.player.anims.currentAnim) return;
      const parts = this.player.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.player.play(parts.join("-"));
      this.player.setVelocity(0, 0);
    }
  }
}
