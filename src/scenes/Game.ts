import Phaser from "phaser";
import { isSpreadElement } from "typescript";

export default class Game extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;

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

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: "overworld" });
    const townTileSet = map.addTilesetImage("Town", "outside");
    const houseTileSet = map.addTilesetImage("Houses", "houses");

<<<<<<< HEAD
    const overworld = map.addTilesetImage("overworld", "Ground");
=======
    const groundLayer = map.createLayer("Ground", townTileSet);
>>>>>>> 73e20381515b69c3f91dd9b8d218202a26c8f8cf

    const debugGraphics = this.add.graphics().setAlpha(0.7);

<<<<<<< HEAD
    map.createLayer("Ground", overworld);
    //map.create
=======
    this.player = this.physics.add.sprite(
      200,
      200,
      "player",
      "green-walk-down-0"
    );

    this.player.body.setSize(this.player.width * 1, this.player.height * 1);

    this.anims.create({
      key: "player-idle-down",
      frames: [{ key: "player", frame: "green-walk-down-0" }],
    });

    this.anims.create({
      key: "player-idle-side",
      frames: [{ key: "player", frame: "green-walk-side-0" }],
    });

    this.anims.create({
      key: "player-idle-up",
      frames: [{ key: "player", frame: "green-walk-up-0" }],
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

    this.anims.create({
      key: "player-walk-up",
      frames: this.anims.generateFrameNames("player", {
        start: 0,
        end: 7,
        prefix: "green-walk-up-",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "player-walk-side",
      frames: this.anims.generateFrameNames("player", {
        start: 0,
        end: 7,
        prefix: "green-walk-side-",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.player.anims.play("player-walk-down", true);
    this.player.setCollideWorldBounds(true);

    const housesLayer = map.createLayer("Houses", houseTileSet);
    const wallsLayer = map.createLayer("Walls", townTileSet);

    this.cameras.main.startFollow(this.player, true);

    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(234, 234, 48, 24),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    wallsLayer.setCollisionByProperty({ collides: true });
    housesLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, housesLayer);
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }

    const speed = 100;

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
      this.player.play("player-idle-down", true);
      this.player.setVelocity(0, 0);
      this.player.scaleY = 1;

      const parts = this.player.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.player.play(parts.join("-"));
      this.player.setVelocity(0, 0);
    }
>>>>>>> 73e20381515b69c3f91dd9b8d218202a26c8f8cf
  }
}
