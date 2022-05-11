import Phaser from "phaser";
import { debugDraw } from "../utils/debug";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("hospital");
  }

  preload() {
    //Load graphics for hospital.
    this.load.image("items", "tiles/LabItems.png");
    this.load.image("building", "tiles/ModernTiles.png");

    this.load.tilemapTiledJSON("hospital", "tiles/hospital.tmj");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets so that we can access Tiled data later on.

    const map = this.make.tilemap({ key: "hospital" });
    console.log("In hospital");
    const buildingTileSet = map.addTilesetImage("futurevibes", "building");
    const labTileSet = map.addTilesetImage("labstuff", "items");
    const hospitalTilesets = [buildingTileSet, labTileSet];

    //Create ground layer first using tile set data.
    const floorLayer = map.createLayer("floor", hospitalTilesets);
    const floorObjLayer = map.createLayer("upper floor", hospitalTilesets);
    const lowObjLayer = map.createLayer("lower dead objects", hospitalTilesets);
    const highObjLayer = map.createLayer(
      "upper dead objects",
      hospitalTilesets
    );

    this.player = this.physics.add.sprite(
      105,
      550,
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

    floorLayer.setCollisionByProperty({ collides: true });
    lowObjLayer.setCollisionByProperty({ collides: true });
    highObjLayer.setCollisionByProperty({ collides: true });


    this.physics.add.collider(this.player, lowObjLayer);
    this.physics.add.collider(this.player, highObjLayer);
    this.physics.add.collider(this.player, floorLayer);

    debugDraw(floorLayer, this);
    debugDraw(highObjLayer, this);
    debugDraw(lowObjLayer, this);

  }

  update() {
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
